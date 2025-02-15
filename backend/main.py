from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, documents, sessions, chat, tools
from utils.logger import get_logger
from database import init_db

"""
Main FastAPI application entry point.
Initializes the database and includes all routers.
"""

logger = get_logger(__name__)

# Initialize DB tables at startup (optional: can run create_tables.py to reset)
init_db()

app = FastAPI(title="RAG Local LLM System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(tools.router, prefix="/tools", tags=["Tools"])

@app.get("/")
def read_root():
    logger.debug("Root endpoint accessed.")
    return {"message": "Welcome to the RAG Local LLM System backend"}