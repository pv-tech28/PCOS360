from fastapi import APIRouter
from app.api.routes import (
    auth,
    health,
    profile,
    cycles,
    symptoms,
    lifestyle,
    lab_reports,
    clinical_records,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(profile.router)
api_router.include_router(cycles.router)
api_router.include_router(symptoms.router)
api_router.include_router(lifestyle.router)
api_router.include_router(lab_reports.router)
api_router.include_router(clinical_records.router)
