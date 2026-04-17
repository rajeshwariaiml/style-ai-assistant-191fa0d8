"""
Notification Routes
===================
Defines the HTTP routes for deadline alerts.

Endpoint:
    GET /notifications?user_email=<email>

This route delegates to the notification controller, which in turn calls
the notification service. No existing endpoints are modified.
"""

from fastapi import APIRouter, Query
from typing import Optional

from controllers.notification_controller import get_user_notifications

router = APIRouter(tags=["notifications"])


@router.get("/notifications")
def list_notifications(
    user_email: Optional[str] = Query(
        default=None,
        description="Email of the user whose saved-scheme deadlines should be checked.",
    ),
):
    """
    Returns a list of deadline alerts for the user's saved schemes.

    Each alert contains:
        - scheme_name
        - deadline (YYYY-MM-DD)
        - status: 'upcoming' | 'expired' | 'today' | 'far'
        - message: human-readable alert text
        - days_remaining: int (negative if expired)
    """
    return get_user_notifications(user_email)
