"""reconcile_lab_reports_fk_for_auth

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-11-12 22:44:00.000000

"""
from typing import Sequence, Union

from alembic import context, op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Ensure lab_reports foreign key references users(id) and required columns exist."""
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if 'lab_reports' not in set(inspector.get_table_names()):
        return

    lab_cols = {c['name'] for c in inspector.get_columns('lab_reports')}
    with op.batch_alter_table('lab_reports') as batch_op:
        if 'report_name' not in lab_cols:
            batch_op.add_column(sa.Column('report_name', sa.String(length=255), nullable=True))
        if 'test_name' not in lab_cols:
            batch_op.add_column(sa.Column('test_name', sa.String(length=150), nullable=True))
        if 'test_value' not in lab_cols:
            batch_op.add_column(sa.Column('test_value', sa.Float(), nullable=True))
        if 'unit' not in lab_cols:
            batch_op.add_column(sa.Column('unit', sa.String(length=50), nullable=True))
        if 'reference_range' not in lab_cols:
            batch_op.add_column(sa.Column('reference_range', sa.String(length=100), nullable=True))
        if 'report_date' not in lab_cols:
            batch_op.add_column(sa.Column('report_date', sa.Date(), nullable=True))

    fks = inspector.get_foreign_keys('lab_reports')
    has_users_fk = any(
        fk.get('referred_table') == 'users' and fk.get('constrained_columns') == ['user_id']
        for fk in fks
    )
    if not has_users_fk:
        for fk in fks:
            if fk.get('constrained_columns') == ['user_id'] and fk.get('name'):
                op.drop_constraint(fk['name'], 'lab_reports', type_='foreignkey')
        op.create_foreign_key(
            'fk_lab_reports_user_id_users',
            'lab_reports',
            'users',
            ['user_id'],
            ['id'],
            ondelete='CASCADE',
        )

    indexes = {idx['name'] for idx in inspector.get_indexes('lab_reports')}
    if 'ix_lab_reports_id' not in indexes:
        op.create_index('ix_lab_reports_id', 'lab_reports', ['id'], unique=False)
    if 'ix_lab_reports_user_id' not in indexes:
        op.create_index('ix_lab_reports_user_id', 'lab_reports', ['user_id'], unique=False)


def downgrade() -> None:
    """Revert custom FK on lab_reports if present."""
    if context.is_offline_mode():
        return

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if 'lab_reports' not in set(inspector.get_table_names()):
        return

    fks = inspector.get_foreign_keys('lab_reports')
    for fk in fks:
        if fk.get('name') == 'fk_lab_reports_user_id_users':
            op.drop_constraint('fk_lab_reports_user_id_users', 'lab_reports', type_='foreignkey')

