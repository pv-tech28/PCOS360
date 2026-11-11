"""add_auth_sessions_and_user_flags

Revision ID: a1b2c3d4e5f6
Revises: cbb42492a859
Create Date: 2026-11-11 19:12:00.000000

"""
from typing import Sequence, Union

from alembic import context, op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'cbb42492a859'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add user status/demo flags, mark legacy passwordless users as demo, and add user_sessions."""
    user_flag_columns = (
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('is_demo', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    offline = context.is_offline_mode()

    if offline:
        for col in user_flag_columns:
            op.add_column('users', col)
    else:
        inspector = sa.inspect(op.get_bind())
        user_cols = {col['name'] for col in inspector.get_columns('users')}
        missing_cols = [col for col in user_flag_columns if col.name not in user_cols]
        if missing_cols:
            with op.batch_alter_table('users') as batch_op:
                for col in missing_cols:
                    batch_op.add_column(col)

    # Preserve pre-existing seeded/development health data cleanly by marking
    # passwordless legacy rows as non-login demo records instead of deleting data
    # or permitting empty-password logins.
    op.execute(
        sa.text("UPDATE users SET is_demo = :demo_val WHERE password_hash IS NULL").bindparams(
            demo_val=True
        )
    )

    create_sessions = True
    if not offline:
        inspector = sa.inspect(op.get_bind())
        create_sessions = 'user_sessions' not in set(inspector.get_table_names())

    if create_sessions:
        op.create_table(
            'user_sessions',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('token_jti', sa.String(length=64), nullable=False),
            sa.Column('user_agent', sa.String(length=255), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        for col_name, unique in (('id', False), ('user_id', False), ('token_jti', True), ('expires_at', False)):
            op.create_index(op.f(f'ix_user_sessions_{col_name}'), 'user_sessions', [col_name], unique=unique)


def downgrade() -> None:
    """Revert user_sessions and user auth/demo flags."""
    session_indexes = (
        'ix_user_sessions_expires_at',
        'ix_user_sessions_token_jti',
        'ix_user_sessions_user_id',
        'ix_user_sessions_id',
    )
    if context.is_offline_mode():
        for idx_name in session_indexes:
            op.drop_index(op.f(idx_name), table_name='user_sessions')
        op.drop_table('user_sessions')
        op.drop_column('users', 'is_demo')
        op.drop_column('users', 'is_active')
        return

    inspector = sa.inspect(op.get_bind())
    existing_tables = set(inspector.get_table_names())

    if 'user_sessions' in existing_tables:
        for idx_name in session_indexes:
            op.drop_index(op.f(idx_name), table_name='user_sessions')
        op.drop_table('user_sessions')

    user_cols = {col['name'] for col in inspector.get_columns('users')}
    cols_to_drop = [name for name in ('is_demo', 'is_active') if name in user_cols]
    if cols_to_drop:
        with op.batch_alter_table('users') as batch_op:
            for col_name in cols_to_drop:
                batch_op.drop_column(col_name)

