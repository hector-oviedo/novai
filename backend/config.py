class Config:
    """
    Holds application configuration parameters:
    - SECRET_KEY and ALGORITHM for JWT
    - DATABASE_URL for DB connection
    - Model settings, etc.
    """
    DEBUG = True
    SECRET_KEY = "CHANGEME_SUPER_SECRET"  # Change in production
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    MODEL_NAME = "deepseek-r1:1.5b"
    MAX_TOKENS = 2048
    TEMPERATURE = 0.7
    CONTEXT_WINDOW = 2048

    DATABASE_URL = "sqlite:///./data/database.db"
