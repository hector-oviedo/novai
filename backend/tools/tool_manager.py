import json
from sqlalchemy.orm import Session
from models.tool import Tool
from utils.logger import get_logger
from tools.plugins.weather import get_weather

logger = get_logger(__name__)

class ToolManager:
    def get_tool_rules(self, db: Session, tool_ids):
        """
        Returns a dict: { tool_id: parsed_rules_json, ... }
        Each 'rules' is the JSON text from the DB. We parse it here for convenience.
        """
        results = {}
        for tool_id in tool_ids:
            tool_obj = db.query(Tool).filter(Tool.id == tool_id).first()
            if not tool_obj:
                logger.warning(f"[ToolManager] No tool found for id={tool_id}")
                continue
            try:
                parsed_rules = json.loads(tool_obj.rules)
                results[tool_id] = parsed_rules
            except json.JSONDecodeError:
                logger.error(f"[ToolManager] Invalid JSON in tool rules: {tool_obj.rules}")
        return results

    def execute_tool(self, db: Session, tool_id: str, params: dict):
        """
        1. Query the Tool record by ID.
        2. Parse rules => extract function_call.
        3. Switch on function_call to return a simulation or dummy result.
        """
        # 1) Find tool record
        tool_obj = db.query(Tool).filter(Tool.id == tool_id).first()
        if not tool_obj:
            return f"[ToolManager] No tool found for id={tool_id}"

        # 2) Parse 'rules'
        try:
            rules_data = json.loads(tool_obj.rules)
            fn_name = rules_data.get("function_call", "")
        except Exception as e:
            logger.error(f"[ToolManager] Could not parse tool rules: {e}")
            return f"[ToolManager] Error parsing tool rules for id={tool_id}"

        # 3) Switch on function_call (e.g. "getWeather", "internetSearch", etc.)
        if fn_name == "getWeather":
            location = params.get("location", "Unknown")
            # Use the plugin
            return get_weather(location)

        # Add more if/elif for other function_call strings:
        # if fn_name == "internetSearch":
        #     query = params.get("query", "")
        #     return f"[Simulated Search] Searching the internet for '{query}'..."
        # ...

        # Default fallback
        return f"[ToolManager] Executed unknown function_call='{fn_name}' with params={params}"