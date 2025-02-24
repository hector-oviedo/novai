import re
import json
from utils.logger import get_logger

logger = get_logger(__name__)

class ToolParser:
    @staticmethod
    def extract_first_json(text: str) -> dict:
        """
        1) Remove all <think>...</think> segments to ignore chain-of-thought.
        2) Look for a fenced code block like ```json ... ```
           If found, parse the inside.
        3) If no fenced block, fallback to naive approach: find the first '{' and last '}'.
        4) Return the parsed dict if successful, otherwise None.
        """

        # 1) Remove chain-of-thought text: <think>...</think>
        cleaned_text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)

        # 2) Try code fence approach first
        fenced_block = re.search(
            r'```json\s*(\{.*?\})\s*```',
            cleaned_text,
            flags=re.DOTALL
        )
        if fenced_block:
            code_content = fenced_block.group(1).strip()
            parsed = ToolParser._try_json_parse(code_content)
            if parsed is not None:
                return parsed

        # 3) Fallback: find the first '{' and the last '}'
        start_idx = cleaned_text.find('{')
        end_idx = cleaned_text.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            maybe_json = cleaned_text[start_idx:end_idx+1].strip()
            parsed = ToolParser._try_json_parse(maybe_json)
            if parsed is not None:
                return parsed

        logger.debug("[ToolParser] Unable to extract valid JSON from text.")
        return None

    @staticmethod
    def _try_json_parse(json_str: str) -> dict:
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            return None
