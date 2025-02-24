from utils.logger import get_logger
from tools.tool_inference import ToolInference

logger = get_logger(__name__)

class ToolEngine:
    def __init__(self):
        self.tool_inference = ToolInference()

    def run_tool_pass(self, db, session_id, user_message, tool_ids, llm_service=None):
        """
        1) If no tools, return None immediately
        2) Ask if tool is needed
        3) If LLM says yes, execute
        """
        logger.debug("[ToolEngine] run_tool_pass called.")
        if not tool_ids:
            return None

        # LLM reference is needed for single_shot_infer
        if not llm_service:
            logger.debug("[ToolEngine] No LLM service provided.")
            return None

        use_tool, tool_payload = self.tool_inference.decide_if_tool_needed(
            db, session_id, user_message, tool_ids, llm_service
        )

        if not use_tool:
            logger.debug("[ToolEngine] LLM decided no tool needed.")
            return None

        logger.debug("[ToolEngine] LLM decided tool usage. Executing tool...")
        result = self.tool_inference.execute_tool_with_retries(db, tool_payload)
        return result
