"""
Handles token usage and context window calculation (not fully integrated).
"""

from utils.logger import get_logger

logger = get_logger(__name__)

class TokenManager:
    def __init__(self, max_tokens):
        self.max_tokens = max_tokens
        logger.debug(f"TokenManager initialized (max_tokens={max_tokens})")

    def calculate_usage(self, session):
        """
        Example usage metric. Expand for real token counting.
        """
        logger.debug(f"Calculating tokens for session {session.session_id}")
        used_tokens = len(session.messages) * 10  # naive approach
        return {
            "max_tokens": self.max_tokens,
            "used_tokens": used_tokens,
            "percentage_left": (100.0 * (self.max_tokens - used_tokens) / self.max_tokens)
        }
