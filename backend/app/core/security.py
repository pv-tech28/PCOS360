"""Password hashing (scrypt) and signed HS256 JWT token utilities."""
import base64
import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple
from app.core.config import settings

_SCRYPT_N = 16384
_SCRYPT_R = 8
_SCRYPT_P = 1
_SCRYPT_DKLEN = 32


class TokenError(Exception):
    """Raised when an authentication token is invalid or expired."""


def ensure_utc(dt: datetime) -> datetime:
    """Normalize naive (SQLite) or aware datetimes to UTC for safe comparison."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def hash_password(password: str) -> str:
    """Hash a plaintext password using memory-hard scrypt with a random 16-byte salt."""
    salt = secrets.token_bytes(16)
    derived = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=_SCRYPT_N,
        r=_SCRYPT_R,
        p=_SCRYPT_P,
        dklen=_SCRYPT_DKLEN,
    )
    return (
        f"$scrypt$n={_SCRYPT_N},r={_SCRYPT_R},p={_SCRYPT_P}$"
        f"{_b64url_encode(salt)}${_b64url_encode(derived)}"
    )


def verify_password(plain_password: str, stored_hash: Optional[str]) -> bool:
    """Verify a plaintext password against a stored scrypt hash in constant time."""
    if not plain_password or not stored_hash:
        return False
    try:
        parts = stored_hash.split("$")
        if len(parts) != 5 or parts[1] != "scrypt":
            return False
        param_map = dict(item.split("=", 1) for item in parts[2].split(","))
        n = int(param_map["n"])
        r = int(param_map["r"])
        p = int(param_map["p"])
        salt = _b64url_decode(parts[3])
        expected = _b64url_decode(parts[4])
        candidate = hashlib.scrypt(
            plain_password.encode("utf-8"),
            salt=salt,
            n=n,
            r=r,
            p=p,
            dklen=len(expected),
        )
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False


# Fixed dummy hash used when email does not exist so login timing remains uniform.
_DUMMY_PASSWORD_HASH = hash_password("PCOS360_timing_guard_placeholder_2026")


def verify_dummy_password(plain_password: str) -> None:
    """Run constant-work hash check when a user record does not exist or has no hash."""
    verify_password(plain_password, _DUMMY_PASSWORD_HASH)


def create_access_token(
    user_id: int,
    jti: str,
    expires_delta: Optional[timedelta] = None,
) -> Tuple[str, datetime]:
    """Create a signed HS256 JWT bound to user_id (`sub`) and session ID (`jti`)."""
    now = datetime.now(timezone.utc)
    expires_at = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user_id),
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_b64}.{payload_b64}.{_b64url_encode(signature)}", expires_at


def decode_access_token(token: str) -> Dict[str, Any]:
    """Validate HS256 JWT signature, algorithm, structure, and expiration."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise TokenError("Malformed authentication token.")
        header_b64, payload_b64, sig_b64 = parts

        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        provided_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, provided_sig):
            raise TokenError("Invalid token signature.")

        header = json.loads(_b64url_decode(header_b64).decode("utf-8"))
        if header.get("alg") != "HS256" or header.get("typ") != "JWT":
            raise TokenError("Unsupported token type or algorithm.")

        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
        sub = payload.get("sub")
        jti = payload.get("jti")
        exp = payload.get("exp")
        if not sub or not jti or not isinstance(exp, (int, float)):
            raise TokenError("Incomplete token claims.")
        if int(datetime.now(timezone.utc).timestamp()) >= int(exp):
            raise TokenError("Authentication session has expired.")

        payload["user_id"] = int(sub)
        return payload
    except TokenError:
        raise
    except Exception as exc:
        raise TokenError("Invalid authentication token.") from exc

