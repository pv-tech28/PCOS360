from sqlalchemy.orm import Session
from app.models.user import User


def ensure_dev_user(db: Session, user_id: int = 1) -> User:
    """Ensures a development user exists in the database for foreign key integrity."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            full_name="Ananya Sharma",
            email="ananya@example.com",
            password_hash=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
