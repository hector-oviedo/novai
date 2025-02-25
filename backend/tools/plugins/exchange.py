import requests
import time

EXCHANGE_API_KEY = "YOUR_API_KEY_HERE"

def convert_currency(from_currency: str, to_currency: str, amount: float) -> str:
    """
    Convert an amount from one currency to another using the Exchangerates API.
    Endpoint: https://api.exchangeratesapi.io/v1/convert?access_key=API_KEY
    Query params:
      from, to, amount
    """
    time.sleep(1.0)  # optional: simulate latency

    url = "https://api.exchangeratesapi.io/v1/convert"
    params = {
        "access_key": EXCHANGE_API_KEY,
        "from": from_currency.upper(),
        "to": to_currency.upper(),
        "amount": amount
    }

    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()

        # Check success
        if not data.get("success", False):
            return f"Conversion request failed. Response: {data}"

        result_value = data.get("result")
        if result_value is None:
            return f"No 'result' found in response: {data}"

        return f"{amount} {from_currency} equals {result_value:.2f} {to_currency}."
    except Exception as e:
        return f"Error fetching currency data: {e}"
