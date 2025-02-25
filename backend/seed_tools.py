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
        "name": "What time is it?",
        "description": "Returns the current local time (hour:minute) and whether it's morning, afternoon, or night.",
        "rules": """
{
  "function_call": "getLocalTime",
  "description": "Returns the current local time (hour:minute) and whether it's morning, afternoon, or night.",
  "parameters": {
    "type": "object",
    "properties": {
    },
    "required": []
  }
}
"""
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Currency Converter",
        "description": "Converts an amount from one currency to another.",
        "rules": """
{
  "function_call": "convertCurrency",
  "description": "Converts an amount from one currency to another (e.g. USD to EUR).",
  "parameters": {
    "type": "object",
    "properties": {
      "from_currency": { "type": "string", "description": "3-letter code for currency to convert from (e.g. 'USD')." },
      "to_currency": { "type": "string", "description": "3-letter code for currency to convert to (e.g. 'EUR')." },
      "amount": { "type": "number", "description": "The amount to be converted." }
    },
    "required": ["from_currency","to_currency","amount"]
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
