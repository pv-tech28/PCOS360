from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import profile, tracker, labs, simulator, copilot

# Create tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PCOS360 API",
    description="AI-Powered PCOS Health Intelligence Platform Backend",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(profile.router, prefix="/api/v1")
app.include_router(tracker.router, prefix="/api/v1")
app.include_router(labs.router, prefix="/api/v1")
app.include_router(simulator.router, prefix="/api/v1")
app.include_router(copilot.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "platform": "PCOS360",
        "tagline": "Beyond Symptoms. Understand Your PCOS.",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

