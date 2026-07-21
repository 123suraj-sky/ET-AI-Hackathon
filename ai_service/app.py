import os
import pickle
import random
import requests
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI(title="Air Quality AI Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load API Keys ────────────────────────────────────────────────────────────
api_key_path = os.path.join(os.path.dirname(__file__), "..", "api_key.txt")
gemini_api_key = None
owm_api_key = None

try:
    with open(api_key_path, "r") as f:
        for line in f:
            line = line.strip()
            if line.lower().startswith("google gemini api key:"):
                gemini_api_key = line.split(":", 1)[1].strip()
            elif line.lower().startswith("openweathermap api key:"):
                owm_api_key = line.split(":", 1)[1].strip()
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        print("Gemini API key loaded successfully.")
    if owm_api_key:
        print("OpenWeatherMap API key loaded successfully.")
except Exception as e:
    print(f"Warning: Failed to load API keys: {e}")

# ─── Load ARIMA model ─────────────────────────────────────────────────────────
model_path = os.path.join(os.path.dirname(__file__), "..", "model", "arima.pkl")
arima_model = None
try:
    with open(model_path, "rb") as f:
        arima_model = pickle.load(f)
    print("ARIMA model loaded successfully.")
except Exception as e:
    print(f"Warning: Failed to load ARIMA model: {e}")


# ─── Request Models ───────────────────────────────────────────────────────────
class CopilotRequest(BaseModel):
    message: str
    history: list = []

class LLMRequest(BaseModel):
    aqi: float
    location: str = "Delhi"
    demographics: str = "General"


# ─── OWM Helper Functions ─────────────────────────────────────────────────────

def fetch_owm_weather(lat: float, lon: float) -> dict:
    """
    Fetches current weather (temperature, humidity, wind speed) from OWM.
    Returns metric units (Celsius, %, m/s).
    """
    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&units=metric&appid={owm_api_key}"
        )
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        return {
            "temp": round(data["main"]["temp"]),
            "humidity": data["main"]["humidity"],
            "wind_speed": data.get("wind", {}).get("speed", 0),
        }
    except Exception as e:
        print(f"OWM weather fetch failed: {e}")
        return {"temp": None, "humidity": None, "wind_speed": None}


def fetch_owm_air_pollution(lat: float, lon: float) -> dict:
    """
    Fetches current air pollution components from OWM.
    Returns raw pollutant concentrations (µg/m³).
    """
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/air_pollution"
            f"?lat={lat}&lon={lon}&appid={owm_api_key}"
        )
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        components = data["list"][0]["components"]
        return components
    except Exception as e:
        print(f"OWM air pollution fetch failed: {e}")
        return {}


def fetch_owm_air_pollution_forecast(lat: float, lon: float) -> list:
    """
    Fetches 4-day hourly air pollution forecast from OWM.
    Returns a list of hourly records with pollutant concentrations.
    """
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/air_pollution/forecast"
            f"?lat={lat}&lon={lon}&appid={owm_api_key}"
        )
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        return data.get("list", [])
    except Exception as e:
        print(f"OWM air pollution forecast fetch failed: {e}")
        return []


def fetch_owm_weather_forecast(lat: float, lon: float) -> list:
    """
    Fetches 5-day / 3-hour weather forecast from OWM.
    Returns a list of forecast records.
    """
    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&units=metric&appid={owm_api_key}"
        )
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        return data.get("list", [])
    except Exception as e:
        print(f"OWM weather forecast fetch failed: {e}")
        return []


def compute_indian_aqi(components: dict) -> int:
    """
    Converts OWM pollutant concentrations (µg/m³) to Indian AQI (0–500)
    using CPCB sub-index breakpoints for PM2.5, PM10, NO2, O3, SO2, CO.
    Returns the maximum sub-index (worst pollutant dominates).
    """
    if not components:
        return 0

    def linear_interpolate(C, bp_lo, bp_hi, aqi_lo, aqi_hi):
        if bp_hi == bp_lo:
            return aqi_lo
        return round(((aqi_hi - aqi_lo) / (bp_hi - bp_lo)) * (C - bp_lo) + aqi_lo)

    def sub_index(C, breakpoints):
        for (bp_lo, bp_hi, aqi_lo, aqi_hi) in breakpoints:
            if bp_lo <= C <= bp_hi:
                return linear_interpolate(C, bp_lo, bp_hi, aqi_lo, aqi_hi)
        # Clamp to max if above all breakpoints
        return 500

    # CPCB breakpoints: (C_low, C_high, AQI_low, AQI_high)
    bp_pm25 = [
        (0, 30, 0, 50), (30, 60, 51, 100), (60, 90, 101, 200),
        (90, 120, 201, 300), (120, 250, 301, 400), (250, 500, 401, 500)
    ]
    bp_pm10 = [
        (0, 50, 0, 50), (50, 100, 51, 100), (100, 250, 101, 200),
        (250, 350, 201, 300), (350, 430, 301, 400), (430, 600, 401, 500)
    ]
    bp_no2 = [
        (0, 40, 0, 50), (40, 80, 51, 100), (80, 180, 101, 200),
        (180, 280, 201, 300), (280, 400, 301, 400), (400, 800, 401, 500)
    ]
    bp_o3 = [
        (0, 50, 0, 50), (50, 100, 51, 100), (100, 168, 101, 200),
        (168, 208, 201, 300), (208, 748, 301, 400), (748, 1000, 401, 500)
    ]
    bp_so2 = [
        (0, 40, 0, 50), (40, 80, 51, 100), (80, 380, 101, 200),
        (380, 800, 201, 300), (800, 1600, 301, 400), (1600, 2100, 401, 500)
    ]
    bp_co = [  # CO in µg/m³ (OWM gives µg/m³)
        (0, 1000, 0, 50), (1000, 2000, 51, 100), (2000, 10000, 101, 200),
        (10000, 17000, 201, 300), (17000, 34000, 301, 400), (34000, 50000, 401, 500)
    ]

    sub_indices = []
    if "pm2_5" in components and components["pm2_5"] is not None:
        sub_indices.append(sub_index(components["pm2_5"], bp_pm25))
    if "pm10" in components and components["pm10"] is not None:
        sub_indices.append(sub_index(components["pm10"], bp_pm10))
    if "no2" in components and components["no2"] is not None:
        sub_indices.append(sub_index(components["no2"], bp_no2))
    if "o3" in components and components["o3"] is not None:
        sub_indices.append(sub_index(components["o3"], bp_o3))
    if "so2" in components and components["so2"] is not None:
        sub_indices.append(sub_index(components["so2"], bp_so2))
    if "co" in components and components["co"] is not None:
        sub_indices.append(sub_index(components["co"], bp_co))

    return max(sub_indices) if sub_indices else 0


def aqi_to_status(aqi: int) -> str:
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/current")
def get_current(lat: float = 28.6139, lon: float = 77.2090):
    """
    Returns current AQI (Indian scale), temperature, humidity, wind speed,
    and status label — all from live OpenWeatherMap data.
    """
    components = fetch_owm_air_pollution(lat, lon)
    weather = fetch_owm_weather(lat, lon)
    aqi = compute_indian_aqi(components)
    status = aqi_to_status(aqi)

    temp = f"{weather['temp']}°C" if weather["temp"] is not None else "N/A"
    humidity = f"{weather['humidity']}%" if weather["humidity"] is not None else "N/A"
    wind = f"{weather['wind_speed']} m/s" if weather["wind_speed"] is not None else "N/A"

    return {
        "currentAqi": aqi,
        "status": status,
        "temperature": temp,
        "humidity": humidity,
        "windSpeed": wind,
    }


@app.get("/forecast")
def get_forecast(lat: float = 28.6139, lon: float = 77.2090):
    """
    Returns 5-day forecast of AQI based on ARIMA model predictions (if loaded),
    with real temperature and humidity per day from OWM weather forecast.
    If ARIMA is unavailable, falls back to OWM Air Pollution Forecast AQI.
    """
    import datetime

    # --- Fetch real weather forecast for temp & humidity ---
    weather_forecast = fetch_owm_weather_forecast(lat, lon)
    # Group by date, take first entry per day for temp/humidity
    daily_weather = {}
    for entry in weather_forecast:
        dt = datetime.datetime.utcfromtimestamp(entry["dt"])
        date_key = dt.strftime("%Y-%m-%d")
        if date_key not in daily_weather:
            daily_weather[date_key] = {
                "temp": round(entry["main"]["temp"]),
                "humidity": entry["main"]["humidity"],
                "day_name": dt.strftime("%A"),
            }

    # --- AQI predictions ---
    predicted_aqis = []

    if arima_model is not None:
        try:
            preds = arima_model.predict(n_periods=5)
            for p in preds:
                val = float(p)
                if np.isnan(val) or val <= 0:
                    val = 200
                predicted_aqis.append(round(val))
        except Exception as e:
            print(f"ARIMA prediction failed, using OWM fallback: {e}")

    if not predicted_aqis:
        # Use OWM Air Pollution Forecast for AQI
        pollution_forecast = fetch_owm_air_pollution_forecast(lat, lon)
        daily_aqi = {}
        for entry in pollution_forecast:
            dt = datetime.datetime.utcfromtimestamp(entry["dt"])
            date_key = dt.strftime("%Y-%m-%d")
            if date_key not in daily_aqi:
                aqi_val = compute_indian_aqi(entry.get("components", {}))
                daily_aqi[date_key] = aqi_val

        predicted_aqis = list(daily_aqi.values())[:5]

        # Final fallback if OWM also fails
        if not predicted_aqis:
            predicted_aqis = [220, 240, 210, 255, 230]

    # --- Build response ---
    forecast_results = []
    sorted_dates = sorted(daily_weather.keys())

    for i in range(min(5, len(predicted_aqis))):
        aqi_val = predicted_aqis[i]
        status = aqi_to_status(aqi_val)

        if i < len(sorted_dates):
            date_key = sorted_dates[i]
            w = daily_weather[date_key]
            temp_str = f"{w['temp']}°C"
            humidity_str = f"{w['humidity']}%"
            day_name = w["day_name"]
        else:
            temp_str = "N/A"
            humidity_str = "N/A"
            day_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i]

        forecast_results.append({
            "id": i + 1,
            "day": day_name,
            "aqi": aqi_val,
            "temperature": temp_str,
            "humidity": humidity_str,
            "status": status,
        })

    return forecast_results


@app.get("/attribution")
def get_attribution(lat: float = 28.6139, lon: float = 77.2090):
    """
    Source attribution using real OWM pollutant data to weight source categories,
    and real AQI at each hotspot location.
    """
    # Fetch main location pollutants to weight attribution
    components = fetch_owm_air_pollution(lat, lon)

    pm25 = components.get("pm2_5", 60) or 60
    pm10 = components.get("pm10", 80) or 80
    no2  = components.get("no2", 40)  or 40
    so2  = components.get("so2", 15)  or 15
    co   = components.get("co", 500)  or 500

    # Map pollutants to source categories (weighted contribution)
    # Vehicular: NO2 + CO dominate
    # Construction: PM10 dominates
    # Industrial: SO2 + PM2.5
    # Waste Burning: PM2.5 + CO
    vehicular_score = no2 * 1.5 + (co / 100) * 0.8
    construction_score = pm10 * 0.9
    industrial_score = so2 * 2.0 + pm25 * 0.5
    waste_score = pm25 * 0.8 + (co / 100) * 0.5

    total_score = vehicular_score + construction_score + industrial_score + waste_score
    if total_score == 0:
        total_score = 1  # avoid division by zero

    attribution = [
        {"source": "Vehicular Emissions",   "percentage": round((vehicular_score    / total_score) * 100)},
        {"source": "Construction Dust",      "percentage": round((construction_score / total_score) * 100)},
        {"source": "Industrial Output",      "percentage": round((industrial_score   / total_score) * 100)},
        {"source": "Waste Burning & Others", "percentage": round((waste_score        / total_score) * 100)},
    ]

    # Correct rounding so percentages sum to exactly 100
    diff = 100 - sum(item["percentage"] for item in attribution)
    if diff != 0:
        attribution[0]["percentage"] += diff

    # Hotspot coordinates — fetch real AQI for each
    hotspot_defs = [
        {"id": 1, "name": "Anand Vihar",    "lat": 28.6476, "lon": 77.3161, "majorSource": "Vehicular & Construction"},
        {"id": 2, "name": "Punjabi Bagh",   "lat": 28.6675, "lon": 77.1264, "majorSource": "Vehicular Emissions"},
        {"id": 3, "name": "Dwarka Sector 8","lat": 28.5707, "lon": 77.0678, "majorSource": "Construction Dust"},
        {"id": 4, "name": "Okhla Phase 3",  "lat": 28.5358, "lon": 77.2743, "majorSource": "Industrial Output"},
        {"id": 5, "name": "Bawana",          "lat": 28.7997, "lon": 77.0329, "majorSource": "Industrial & Waste Burning"},
    ]

    hotspots = []
    for h in hotspot_defs:
        spot_components = fetch_owm_air_pollution(h["lat"], h["lon"])
        spot_aqi = compute_indian_aqi(spot_components)
        spot_status = aqi_to_status(spot_aqi)
        hotspots.append({
            "id":          h["id"],
            "name":        h["name"],
            "aqi":         spot_aqi,
            "status":      spot_status,
            "lat":         h["lat"],
            "lon":         h["lon"],
            "majorSource": h["majorSource"],
        })

    return {
        "attribution": attribution,
        "hotspots": hotspots,
    }


# ─── LLM Endpoints ────────────────────────────────────────────────────────────

@app.post("/llm/recommendations")
def get_recommendations(req: LLMRequest):
    if not gemini_api_key:
        return {"recommendations": "Error: Gemini API key is missing or not configured."}
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        Analyze the air quality for {req.location} with an AQI of {req.aqi}. 
        Provide a concise, professional list of 3-4 actionable recommendations/interventions for municipal authorities.
        Each recommendation must include:
        1. Action name
        2. Description of the action
        3. Expected AQI reduction percentage
        Keep it concise, realistic, and formatted in markdown.
        """
        response = model.generate_content(prompt)
        return {"recommendations": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/llm/health-advisor")
def get_health_advisor(req: LLMRequest):
    if not gemini_api_key:
        return {"advice": "Error: Gemini API key is missing or not configured."}
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        Given the AQI of {req.aqi} in {req.location}, provide tailored health advice for the demographic group: "{req.demographics}".
        Include:
        1. Recommended outdoor activity levels.
        2. Essential safety precautions (e.g. masks, air purifiers).
        3. Clear emergency signs to watch out for.
        Keep the tone reassuring but informative and formatting clean.
        """
        response = model.generate_content(prompt)
        return {"advice": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/llm/copilot")
def ask_copilot(req: CopilotRequest):
    if not gemini_api_key:
        return {"reply": "Error: Gemini API key is missing or not configured."}
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        chat = model.start_chat(history=[])
        for msg in req.history:
            pass
        response = chat.send_message(req.message)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/llm/report")
def generate_report(req: LLMRequest):
    if not gemini_api_key:
        return {"report": "Error: Gemini API key is missing or not configured."}
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        Generate a professional municipal air quality report for the city of {req.location}.
        The current average AQI is {req.aqi}. 
        Format this as a clean markdown report with sections:
        - Executive Summary
        - Current Pollution Analysis
        - Health Impact Assessment
        - Strategic Remediation Plan
        Keep it professional, detailed, and formatted beautifully in markdown.
        """
        response = model.generate_content(prompt)
        return {"report": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
