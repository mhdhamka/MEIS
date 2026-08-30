from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.elections import router as elections_router
from app.routes.parties import router as parties_router
from app.routes.states import router as states_router
from app.routes.seats import router as seats_router
from app.routes.results import router as results_router
from app.routes.candidates import router as candidates_router
from app.routes.analytics import router as analytics_router
from app.routes.map_results import router as map_router


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="Malaysia Electoral Intelligence System API",
    description="REST API for Malaysian election data and analytics.",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    elections_router,
    prefix="/api/v1/elections",
    tags=["Elections"],
)

app.include_router(
    parties_router,
    prefix="/api/v1/parties",
    tags=["Parties"],
)

app.include_router(
    states_router,
    prefix="/api/v1/states",
    tags=["States"],
)

app.include_router(
    seats_router,
    prefix="/api/v1/seats",
    tags=["Seats"],
)

app.include_router(
    results_router,
    prefix="/api/v1/results",
    tags=["Results"],
)

app.include_router(
    candidates_router,
    prefix="/api/v1/candidates",
    tags=["Candidates"],
)

app.include_router(
    analytics_router,
    prefix="/api/v1/analytics",
    tags=["Analytics"],
)

app.include_router(
    map_router,
    prefix="/api/v1/map",
    tags=["Map"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "system": "Malaysia Election Intelligence System",
        "status": "online",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }