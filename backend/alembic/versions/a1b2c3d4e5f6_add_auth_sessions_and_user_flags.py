"""add_auth_sessions_and_user_flags

Revision ID: a1b2c3d4e5f6
Revises: cbb42492a859
Create Date: 2026-11-11 19:12:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'cbb42492a859'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add user status/demo flags, mark legacy passwordless users as demo, and add user_sessions."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    user_cols = {col['name'] for col in inspector.get_columns('users')}
    with op.batch_alter_table('users') as batch_op:
        if 'is_active' not in user_cols:
            batch_op.add_column(
                sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true())
            )
        if 'is_demo' not in user_cols:
            batch_op.add_column(
                sa.Column('is_demo', sa.Boolean(), nullable=False, server_default=sa.false())
            )

    # Preserve pre-existing seeded/development health data cleanly by marking
    # passwordless legacy rows as non-login demo records instead of deleting data
    # or permitting empty-password logins.
    op.execute(
        sa.text("UPDATE users SET is_demo = :demo_val WHERE password_hash IS NULL").bindparams(
            demo_val=True
        )
    )

    existing_tables = set(inspector.get_table_names())
    if 'user_sessions' not in existing_tables:
        op.create_table(
            'user_sessions',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('token_jti', sa.String(length=64), nullable=False),
            sa.Column('user_agent', sa.String(length=255), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_user_sessions_id'), 'user_sessions', ['id'], unique=False)
        op.create_index(op.f('ix_user_sessions_user_id'), 'user_sessions', ['user_id'], unique=False)
        op.create_index(op.f('ix_user_sessions_token_jti'), 'user_sessions', ['token_jti'], unique=True)
        op.create_index(op.f('ix_user_sessions_expires_at'), 'user_sessions', ['expires_at'], unique=False)


def downgrade() -> None:
    """Revert user_sessions and user auth/demo flags."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if 'user_sessions' in existing_tables:
        op.drop_index(op.f('ix_user_sessions_expires_at'), table_name='user_sessions')
        op.drop_index(op.f('ix_user_sessions_token_jti'), table_name='user_sessions')
        op.drop_index(op.f('ix_user_sessions_user_id'), table_name='user_sessions')
        op.drop_index(op.f('ix_user_sessions_id'), table_name='user_sessions')
        op.drop_table('user_sessions')

    user_cols = {col['name'] for col in inspector.get_columns('users')}
    with op.batch_alter_table('users') as batch_op:
        if 'is_demo' in user_cols:
            batch_op.drop_column('is_demo')
        if 'is_active' in user_cols:
            batch_op.drop_column('is_active')

