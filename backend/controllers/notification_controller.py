"""
Notification Controller
=======================
Thin layer between the route and the service.

Responsibilities:
    - Validate / normalize the incoming user_email
    - Invoke the notification service
    - Shape the final HTTP response payload
"""

from typing import List, Dict, Any, Optional

from services.notification_service import build_notifications_for_user


def get_user_notifications(user_email: Optional[str]) -> List[Dict[str, Any]]:
    """
    Orchestrates fetching deadline notifications for a user.

    If no user_email is provided, the service returns alerts for all users
    saved in the local saved_schemes.json file (useful for demo).
    """
    normalized_email = (user_email or "").strip().lower() or None
    return build_notifications_for_user(normalized_email)
