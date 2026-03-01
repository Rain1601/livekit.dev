from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routers.agents import router as agents_router

app = FastAPI(title="LiveKit Agent Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
