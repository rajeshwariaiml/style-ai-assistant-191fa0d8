"""
User Model
==========
Pydantic schemas for auth + profile request/response payloads.
No ORM — persistence is JSON files in backend/database/.
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None


class ProfileModel(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    income: Optional[float] = None
    state: Optional[str] = None
    district: Optional[str] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    education_level: Optional[str] = None


class RecommendRequest(BaseModel):
    query: Optional[str] = None
    profile: Optional[dict] = None
    mode: str = "form"  # "nlp" | "form"
    top_k: int = 10
