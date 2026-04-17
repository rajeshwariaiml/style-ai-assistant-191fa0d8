"""
Notification Service
====================
Core business logic for the deadline alert system.

Pipeline:
    1. Load the schemes dataset from /dataset/schemes.json (with fallback
       to /ml_pipeline/dataset/schemes_sample.json so existing data is reused).
    2. Load saved schemes per user from /backend/database/saved_schemes.json.
    3. For each saved scheme, look up its deadline in the dataset.
    4. Compute days_remaining = deadline - today.
    5. Categorize:
         days_remaining  < 0      -> 'expired'
         days_remaining == 0      -> 'today'
         0 < days_remaining <= 7  -> 'upcoming'
         days_remaining  > 7      -> 'far'
    6. Build a human-readable message for each alert.

This module is intentionally pure-Python (stdlib only) so it runs locally
without any extra dependencies beyond FastAPI itself.
"""

from __future__ import annotations

import json
import os
from datetime import date, datetime
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# Path resolution (project-root aware)
# ---------------------------------------------------------------------------

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

DATASET_PRIMARY = os.path.join(PROJECT_ROOT, "dataset", "schemes.json")
DATASET_FALLBACK = os.path.join(
    PROJECT_ROOT, "ml_pipeline", "dataset", "schemes_sample.json"
)
SAVED_SCHEMES_FILE = os.path.join(BACKEND_DIR, "database", "saved_schemes.json")


# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------

def _load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def load_schemes_dataset() -> List[Dict[str, Any]]:
    """Load the schemes catalog. Prefer /dataset, fall back to ml_pipeline."""
    if os.path.exists(DATASET_PRIMARY):
        return _load_json(DATASET_PRIMARY)
    if os.path.exists(DATASET_FALLBACK):
        return _load_json(DATASET_FALLBACK)
    return []


def load_saved_schemes() -> List[Dict[str, Any]]:
    """Load all users' saved schemes. Returns [] if file missing."""
    if not os.path.exists(SAVED_SCHEMES_FILE):
        return []
    data = _load_json(SAVED_SCHEMES_FILE)
    # Allow either a list of user-records or a single user-record
    if isinstance(data, dict):
        return [data]
    return data


# ---------------------------------------------------------------------------
# Deadline detection
# ---------------------------------------------------------------------------

def _parse_deadline(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def _classify(days_remaining: int) -> str:
    if days_remaining < 0:
        return "expired"
    if days_remaining == 0:
        return "today"
    if days_remaining <= 7:
        return "upcoming"
    return "far"


def _build_message(scheme_name: str, days_remaining: int, status: str) -> str:
    if status == "expired":
        return f"Deadline expired for {scheme_name} ({abs(days_remaining)} day(s) ago)"
    if status == "today":
        return f"Last date for {scheme_name} application is today"
    if days_remaining == 1:
        return f"Last date for {scheme_name} application is tomorrow"
    if status == "upcoming":
        return f"Deadline for {scheme_name} is in {days_remaining} days"
    return f"Deadline for {scheme_name} is in {days_remaining} days"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def build_notifications_for_user(
    user_email: Optional[str],
) -> List[Dict[str, Any]]:
    """
    Build the notification list. If `user_email` is None, aggregate alerts
    across every user record in saved_schemes.json (handy for demo).
    """
    schemes = load_schemes_dataset()
    deadline_lookup: Dict[str, Optional[str]] = {}
    for s in schemes:
        name = (s.get("scheme_name") or "").strip().lower()
        if name:
            deadline_lookup[name] = s.get("deadline")

    saved_records = load_saved_schemes()
    today = date.today()
    alerts: List[Dict[str, Any]] = []

    for record in saved_records:
        record_email = (record.get("user_email") or "").strip().lower()
        if user_email and record_email != user_email:
            continue

        for entry in record.get("saved_schemes", []):
            scheme_name = entry.get("scheme_name", "Unknown Scheme")
            # Prefer deadline saved on the record, fall back to dataset lookup
            deadline_str = entry.get("deadline") or deadline_lookup.get(
                scheme_name.strip().lower()
            )
            deadline = _parse_deadline(deadline_str)
            if not deadline:
                continue

            days_remaining = (deadline - today).days
            status = _classify(days_remaining)

            # Per spec: include expired + upcoming-within-7-days primarily,
            # but also surface 'far' deadlines so the UI can show full history.
            alerts.append(
                {
                    "scheme_name": scheme_name,
                    "deadline": deadline.isoformat(),
                    "status": status,
                    "days_remaining": days_remaining,
                    "message": _build_message(scheme_name, days_remaining, status),
                    "user_email": record_email,
                }
            )

    # Sort: expired first (most overdue), then nearest upcoming, then far
    def _sort_key(a: Dict[str, Any]):
        priority = {"expired": 0, "today": 1, "upcoming": 2, "far": 3}[a["status"]]
        return (priority, a["days_remaining"])

    alerts.sort(key=_sort_key)
    return alerts
