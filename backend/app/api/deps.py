"""Authentication dependencies resolving the verified user session from Bearer tokens."""
from datetime import datetime, timezone
from typing import Tuple
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import TokenError, decode_access_token, ensure_utc
from app.models.user import User
from app.models.user_session import UserSession

bearer_scheme = HTTPBearer(auto_error=False)


def _unauthorized(detail: str = "Authentication credentials were missing or invalid.") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_session(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Tuple[User, UserSession]:
    """Validate Bearer JWT signature, active server-side session, and user account state."""
    if not credentials or credentials.scheme.lower() != "bearer" or not credentials.credentials:
        raise _unauthorized("Authentication required. Please sign in.")

    try:
        payload = decode_access_token(credentials.credentials)
    except TokenError as exc:
        raise _unauthorized(str(exc))

    user_id = payload["user_id"]
    jti = payload["jti"]

    session = (
        db.query(UserSession)
        .filter(UserSession.token_jti == jti, UserSession.user_id == user_id)
        .first()
    )
    if not session or session.revoked_at is not None:
        raise _unauthorized("Session has been logged out or is no longer valid.")

    if ensure_utc(session.expires_at) <= datetime.now(timezone.utc):
        raise _unauthorized("Session has expired. Please sign in again.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active or user.is_demo or not user.password_hash:
        raise _unauthorized("Account is inactive or unavailable for authenticated access.")

    return user, session


def get_current_user(
    auth_ctx: Tuple[User, UserSession] = Depends(get_current_session),
) -> User:
    """Return the authenticated User derived strictly from the signed session."""
    return auth_ctx[0]

