"""enable_rls_security_on_public_tables

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-11-12 22:46:00.000000

"""
from typing import Sequence, Union
from alembic import context, op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

PROTECTED_TABLES = (
    'users',
    'user_sessions',
    'health_profiles',
    'menstrual_cycles',
    'daily_symptoms',
    'lifestyle_logs',
    'clinical_records',
    'lab_reports',
    'daily_logs',
    'user_profiles',
    'care_gaps',
    'timeline_events',
)


def upgrade() -> None:
    """Enable Row Level Security on all public patient/health tables."""
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    for table in PROTECTED_TABLES:
        if table in existing_tables:
            op.execute(sa.text(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY;'))


def downgrade() -> None:
    """Disable Row Level Security on public tables."""
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    for table in PROTECTED_TABLES:
        if table in existing_tables:
            op.execute(sa.text(f'ALTER TABLE public."{table}" DISABLE ROW LEVEL SECURITY;'))

