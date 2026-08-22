from fastapi import FastAPI

from app.routes.elections import router as elections_router
from app.routes.parties import router as parties_router
from app.routes.states import router as states_router
from app.routes.seats import router as seats_router


app = FastAPI(
    title="Malaysia Election Intelligence System API",
    description="REST API for Malaysian election data and analytics.",
    version="1.0.0"
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(elections_router)
app.include_router(parties_router)
app.include_router(states_router)
app.include_router(seats_router)


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