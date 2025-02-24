import time

def get_weather(city: str) -> str:
    """Mock weather function with a small delay to simulate an API call."""
    time.sleep(1.0)  # simulate network latency
    return f"It's sunny in {city} at 20°C."
