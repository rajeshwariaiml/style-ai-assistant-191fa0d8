"""
Profile Controller
==================
Reads/writes user profile data to backend/database/profiles.json.
Used by the FastAPI POST /save-profile and GET /get-profile endpoints.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional

from fastapi import HTTPException

PROFILES_FILE = os.path.join(os.path.dirname(__file__), "..", "database", "profiles.json")
PROFILES_FILE = os.path.abspath(PROFILES_FILE)


def _load_profiles() -> List[Dict[str, Any]]:
    if not os.path.exists(PROFILES_FILE):
        return []
    with open(PROFILES_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def _save_profiles(profiles: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(PROFILES_FILE), exist_ok=True)
    with open(PROFILES_FILE, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)


def save_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
    email = (profile.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="email is required to save profile")

    profile["email"] = email
    profiles = _load_profiles()
    idx = next((i for i, p in enumerate(profiles) if p.get("email", "").lower() == email), None)
    if idx is None:
        profiles.append(profile)
    else:
        profiles[idx] = {**profiles[idx], **profile}
    _save_profiles(profiles)

    return {"success": True, "message": "Profile saved", "profile": profile}


def get_profile(email: Optional[str]) -> Dict[str, Any]:
    if not email:
        raise HTTPException(status_code=400, detail="email query parameter is required")
    email_norm = email.strip().lower()
    profiles = _load_profiles()
    profile = next((p for p in profiles if p.get("email", "").lower() == email_norm), None)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
