# services/llm_service.py

from llama_index.llms.ollama import Ollama
from llama_index.core.llms import ChatMessage
from config import Config
from utils.logger import get_logger

logger = get_logger(__name__)

class LLMService:
    """
    Minimal LLMService using llama_index's Ollama class for streaming chat.
    We skip RAG or multi-message logic—just transform the user prompt into
    a single ChatMessage for a quick demonstration.
    """

    def __init__(self):
        self.stop_flag = False
        # Initialize the Ollama LLM pointing to your local server
        self.ollama_llm = Ollama(
            model=Config.MODEL_NAME,               # e.g. "deepseek-r1:1.5b"
            base_url="http://127.0.0.1:11434",     # default Ollama port or your custom
            request_timeout=120.0
        )
        logger.debug(f"LLMService with Ollama model={Config.MODEL_NAME} created")

    def stream_infer(self, prompt: str):
        """
        Streams partial tokens from Ollama by sending a single user message.
        Yields each partial chunk as a string (chunk.delta).
        If an error occurs, yields "LLMError: <reason>" so chat_service can handle it.
        """
        logger.debug(f"Ollama stream_infer called with prompt: {prompt[:60]}...")

        # Create one ChatMessage with role="user"
        messages = [
            ChatMessage(role="user", content=prompt)
        ]

        try:
            # stream_chat(...) yields partial tokens with .delta
            response_gen = self.ollama_llm.stream_chat(messages)
            for chunk in response_gen:
                if self.stop_flag:
                    logger.debug("Stop flag triggered. Stopping inference.")
                    self.stop_flag = False
                    break

                # chunk.delta is the partial text
                yield chunk.delta

        except Exception as e:
            logger.error(f"Error contacting Ollama: {e}")
            yield f"LLMError: {str(e)}\n"

    def stop_inference(self):
        logger.debug("stop_inference called in LLMService.")
        self.stop_flag = True
