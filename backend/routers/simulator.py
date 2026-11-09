from fastapi import APIRouter
import schemas

router = APIRouter(prefix="/simulator", tags=["Simulator"])

@router.post("/evaluate", response_model=schemas.WhatIfResponse)
def evaluate_what_if(req: schemas.WhatIfRequest):
    score = 50
    if req.sleep_target >= 7.5:
        score += 18
    elif req.sleep_target >= 7.0:
        score += 10

    if req.exercise_mins >= 30:
        score += 16
    elif req.exercise_mins >= 20:
        score += 8

    if req.meal_consistency == "High":
        score += 16
    elif req.meal_consistency == "Moderate":
        score += 8

    if req.stress_management:
        score += 12

    score = min(96, score)

    resilience = "High Routine Consistency" if score >= 80 else "Moderate Routine Consistency"

    projected = [
        {"metric": "Afternoon Energy Stability", "impact": "-34% fatigue severity projection"},
        {"metric": "Sleep Latency", "impact": "~15 min faster onset"},
        {"metric": "Glucose Variability", "impact": "Smoother postprandial curve via fiber buffering"}
    ]

    disclaimer = "Simulated lifestyle habit goals only. Does not predict hormonal normalization or clinical disease recovery."

    return schemas.WhatIfResponse(
        habit_score=score,
        routine_resilience=resilience,
        projected_benefits=projected,
        disclaimer=disclaimer
    )

