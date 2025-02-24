import json
from utils.logger import get_logger
from tools.tool_manager import ToolManager
from tools.tool_verify import ToolVerifier
from tools.tool_parser import ToolParser
from models.session import Session

logger = get_logger(__name__)

class ToolInference:
    def __init__(self):
        self.tool_manager = ToolManager()
        self.tool_verifier = ToolVerifier()
        self.max_retries = 2

    from tools.tool_parser import ToolParser

    def decide_if_tool_needed(self, db, session_id, user_message, tool_ids, llm_service):
        logger.debug("[ToolInference] decide_if_tool_needed start.")
        tool_rules_map = self.tool_manager.get_tool_rules(db, tool_ids)
        if not tool_rules_map:
            logger.debug("[ToolInference] No valid tool rules found.")
            return (False, {})

        # Build minimal prompt (same as before)...
        tools_info_str = "\n".join([
            f"Tool ID: {tid}, function_call: {rules['function_call']}, description: {rules['description']}, parameters: {rules['parameters']}"
            for tid, rules in tool_rules_map.items()
        ])
        prompt = f"""
    You are a helpful assistant. The user says: "{user_message}"

    Tools available:
    {tools_info_str}

    Decide if you need any tool to answer. Respond in strict JSON:
    {{
    "use_tool": "yes" or "no",
    "tool_id": "tool_id_if_needed_or_empty",
    "params": {{}} # parameters matching the tool's JSON schema
    }}
    """.strip()

        for attempt in range(self.max_retries):
            logger.debug(f"[ToolInference] Attempt {attempt+1} for LLM tool usage decision.")
            response = llm_service.single_shot_infer(prompt)

            if not response:
                logger.warning("[ToolInference] Empty LLM response.")
                continue

            parsed = ToolParser.extract_first_json(response)
            if not parsed:
                logger.warning("[ToolInference] No valid JSON found in LLM response. Retrying...")
                continue

            # Check final output
            if parsed.get("use_tool") == "yes":
                return (True, parsed)
            else:
                return (False, {})

        logger.debug("[ToolInference] All attempts failed or returned no usage.")
        return (False, {})
    
    def execute_tool_with_retries(self, db: Session, tool_payload: dict):
        logger.debug("[ToolInference] execute_tool_with_retries start.")
        for attempt in range(self.max_retries):
            valid, error_msg = self.tool_verifier.validate_tool_payload(tool_payload)
            if not valid:
                logger.debug(f"[ToolInference] Payload invalid. Error: {error_msg}")
                continue

            tool_id = tool_payload.get("tool_id")
            params = tool_payload.get("params", {})

            # Pass the DB session for lookups inside ToolManager
            result = self.tool_manager.execute_tool(db, tool_id, params)
            if result:
                logger.debug(f"[ToolInference] Tool executed. Result: {result}")
                return result

        return None

