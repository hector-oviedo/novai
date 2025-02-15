"""
Provides standardized error responses across the application.
"""

from utils.logger import get_logger
from config import Config

logger = get_logger(__name__)

class ErrorManager:
    def __init__(self, development_mode=True):
        """
        If development_mode=True, returns detailed error info.
        Otherwise, minimal info for production security.
        """
        self.development_mode = development_mode
        logger.debug(f"ErrorManager in {'dev' if development_mode else 'prod'} mode")

    def handle_error(
        self,
        user_id=None,
        session_id=None,
        code="500",
        message="Internal Server Error",
        description="An error occurred"
    ):
        logger.error(f"Error occurred: {message} (Code: {code})")
        if self.development_mode:
            return {
                "error": True,
                "userId": user_id,
                "sessionId": session_id,
                "code": code,
                "message": message,
                "description": description
            }
        else:
            return {
                "error": True,
                "code": "404",
                "message": "Not Found"
            }
