import requests

# Ideally store your API key in config or as an environment variable
OPENWEATHER_API_KEY = "YOUR_API_KEY_HERE"

def get_weather(city: str) -> str:
    """
    Fetch actual weather data from OpenWeatherMap using city name.
    1) Geocode city => lat, lon
    2) Use lat, lon to get current weather
    """

    # 1) Geocode the city to get lat/lon
    geo_url = "http://api.openweathermap.org/geo/1.0/direct"
    geo_params = {
        "q": city,
        "limit": 1,
        "appid": OPENWEATHER_API_KEY
    }
    try:
        geo_resp = requests.get(geo_url, params=geo_params, timeout=10)
        if geo_resp.status_code != 200:
            return f"Geocoding request failed with status {geo_resp.status_code}."

        geo_data = geo_resp.json()
        if not geo_data:
            return f"Could not find coordinates for '{city}'."

        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]
    except Exception as e:
        return f"Error during geocoding: {e}"

    # 2) Call current weather endpoint using lat/lon
    weather_url = "http://api.openweathermap.org/data/2.5/weather"
    weather_params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"  # or "imperial"
    }
    try:
        w_resp = requests.get(weather_url, params=weather_params, timeout=10)
        if w_resp.status_code != 200:
            return f"Weather request failed with status {w_resp.status_code}."

        w_data = w_resp.json()
        # Parse relevant fields
        temp_c = w_data["main"]["temp"]
        desc = w_data["weather"][0]["description"]
        place_name = w_data.get("name", city)  # sometimes name is missing

        return f"The current weather in {place_name} is {temp_c:.1f}°C with {desc}."
    except Exception as e:
        return f"Error fetching weather data: {e}"
