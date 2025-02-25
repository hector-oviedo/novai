import datetime
import time

def get_local_time() -> str:
    """Return the local system time plus 'morning', 'afternoon', or 'night'."""
    time.sleep(1.0)  # optional, simulating a small delay

    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute

    if hour < 12:
        period = "morning"
    elif hour < 18:
        period = "afternoon"
    else:
        period = "night"

    # Format hour:minute with zero-padded minutes, e.g. 9:07
    formatted_time = f"{hour}:{minute:02d}"

    return f"The current time is {formatted_time} in the {period}."
