# services/llm_service.py

from llama_index.llms.ollama import Ollama
from llama_index.core.llms import ChatMessage
from sqlalchemy.orm import Session

from config import Config
from utils.logger import get_logger
from services.memory_service import MemoryService

logger = get_logger(__name__)

class LLMService:
    """
    LLMService with multi-turn memory via MemoryService.
    """

    def __init__(self):
        self.stop_flag = False
        self.ollama_llm = Ollama(
            model=Config.MODEL_NAME,
            base_url="http://127.0.0.1:11434",
            request_timeout=120.0
        )

    def stream_infer(self, db: Session, session_id: str):
        """
        1) Build the entire chat history from DB using MemoryService
        2) Pass it to Ollama .stream_chat(...)
        3) Yield partial tokens
        If an error occurs, yield "LLMError: <reason>" for chat_service to handle.
        """
        try:
            # 1) Build conversation
            messages = MemoryService.build_chat_history(db, session_id)

            # Log them for debugging
            for i, m in enumerate(messages):
                # Safeguard in case content is None
                content_str = m.content if m.content is not None else ""
                snippet = (content_str[:80] + "...") if len(content_str) > 80 else content_str
                # logger.debug(f"[{i}] role={m.role}, content={snippet}")

            # 2) Stream partial tokens
            response_gen = self.ollama_llm.stream_chat(messages)

            for chunk in response_gen:
                if self.stop_flag:
                    logger.debug("Stop flag triggered. Stopping inference.")
                    self.stop_flag = False
                    break

                # chunk.delta is partial text
                yield chunk.delta

        except Exception as e:
            logger.error(f"Error in LLMService stream_infer: {e}")
            yield f"LLMError: {str(e)}\n"

    def stop_inference(self):
        logger.debug("stop_inference called in LLMService.")
        self.stop_flag = True
