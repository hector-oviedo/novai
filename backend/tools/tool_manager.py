import json
from sqlalchemy.orm import Session
from models.tool import Tool
from utils.logger import get_logger

from tools.plugins.weather import get_weather
from tools.plugins.time_util import get_local_time
from tools.plugins.exchange import convert_currency

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
        
        elif fn_name == "getLocalTime":
            # No required params, so just call it
            return get_local_time()
        
        elif fn_name == "convertCurrency":
            from_cur = params.get("from_currency", "")
            to_cur = params.get("to_currency", "")
            amt = float(params.get("amount", 0))
            return convert_currency(from_cur, to_cur, amt)

        # Default fallback
        return f"[ToolManager] Executed unknown function_call='{fn_name}' with params={params}"