import secrets
from datetime import datetime, timezone
from typing import Tuple
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_session, get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import auth_rate_limiter, get_client_ip
from app.core.security import (
    create_access_token,
    hash_password,
    verify_dummy_password,
    verify_password,
)
from app.models.user import User
from app.models.user_session import UserSession
from app.schemas.user import (
    AuthTokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
    UserUpdate,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _issue_session(db: Session, user: User, user_agent: str | None) -> AuthTokenResponse:
    jti = secrets.token_urlsafe(32)
    token, expires_at = create_access_token(user_id=user.id, jti=jti)
    session = UserSession(
        user_id=user.id,
        token_jti=jti,
        user_agent=(user_agent or "")[:255] or None,
        expires_at=expires_at,
    )
    db.add(session)
    db.commit()
    db.refresh(user)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        expires_at=expires_at,
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def register(payload: UserRegister, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    auth_rate_limiter.consume_or_raise(
        key=f"register:ip:{client_ip}",
        max_attempts=settings.AUTH_REGISTER_MAX_ATTEMPTS,
        window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        detail="Too many registration attempts from this network.",
    )

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_demo=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _issue_session(db, user, request.headers.get("user-agent"))


@router.post(
    "/login",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Sign in with email and password",
)
def login(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = get_client_ip(request)
    ip_key = f"login:ip:{client_ip}"
    acct_key = f"login:acct:{client_ip}:{payload.email}"

    auth_rate_limiter.ensure_allowed(
        key=ip_key,
        max_attempts=settings.AUTH_LOGIN_IP_MAX_ATTEMPTS,
        window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        detail="Too many failed sign-in attempts from this network.",
    )
    auth_rate_limiter.ensure_allowed(
        key=acct_key,
        max_attempts=settings.AUTH_LOGIN_MAX_ATTEMPTS,
        window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        detail="Too many failed sign-in attempts for this account.",
    )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.password_hash or user.is_demo or not user.is_active:
        verify_dummy_password(payload.password)
        auth_rate_limiter.record(ip_key, settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)
        auth_rate_limiter.record(acct_key, settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(payload.password, user.password_hash):
        auth_rate_limiter.record(ip_key, settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)
        auth_rate_limiter.record(acct_key, settings.AUTH_RATE_LIMIT_WINDOW_SECONDS)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    auth_rate_limiter.reset(acct_key)
    return _issue_session(db, user, request.headers.get("user-agent"))


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Revoke the current authentication session",
)
def logout(
    auth_ctx: Tuple[User, UserSession] = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    _, session = auth_ctx
    session.revoked_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Signed out successfully."}


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get the currently authenticated user account",
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update the currently authenticated user's account details",
)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.full_name = payload.full_name
    db.commit()
    db.refresh(current_user)
    return current_user

