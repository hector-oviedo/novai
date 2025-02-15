"""
Populates the 'tools' table with default entries (e.g. internet, weather, location, notifications).
Demonstrates how to store JSON-like schema in the 'rules' field.
"""

import uuid
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models.tool import Tool

init_db()

tools_data = [
    {
        "id": str(uuid.uuid4()),
        "name": "Internet Search",
        "description": "Executes an internet search using a user-provided query.",
        "rules": """
{
  "function_call": "internetSearch",
  "description": "Search the internet for relevant results. Rate-limited to prevent abuse.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "The user search query" }
    },
    "required": ["query"]
  }
}
"""
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Weather Forecast",
        "description": "Retrieves current weather and a short forecast for the specified location.",
        "rules": """
{
  "function_call": "getWeather",
  "description": "Returns current weather conditions and forecast up to 7 days.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name or coordinates" }
    },
    "required": ["location"]
  }
}
"""
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Location Lookup",
        "description": "Provides information about a specified location (country, city).",
        "rules": """
{
  "function_call": "lookupLocation",
  "description": "Get details like timezone, population, landmarks.",
  "parameters": {
    "type": "object",
    "properties": {
      "place": { "type": "string", "description": "City name, country, or coordinates" }
    },
    "required": ["place"]
  }
}
"""
    },
    {
        "id": str(uuid.uuid4()),
        "name": "System Notification",
        "description": "Sends a local or push notification to the user’s device.",
        "rules": """
{
  "function_call": "sendNotification",
  "description": "Sends a system notification with a title and message body.",
  "parameters": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Short headline for the notification"
      },
      "message": {
        "type": "string",
        "description": "The main notification content"
      }
    },
    "required": ["title","message"]
  }
}
"""
    },
]

def seed_tools():
    db: Session = SessionLocal()
    try:
        # If tools already exist, skip seeding
        existing_count = db.query(Tool).count()
        if existing_count > 0:
            print("Tools already exist. Skipping seeding.")
            return

        for t in tools_data:
            new_tool = Tool(
                id=t["id"],
                name=t["name"],
                description=t["description"],
                rules=t["rules"]
            )
            db.add(new_tool)

        db.commit()
        print("Tool records seeded successfully.")
    except Exception as e:
        print(f"Error seeding tools: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_tools()
