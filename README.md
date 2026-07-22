# 🌫️ AirSense — AI-Powered Air Quality Intelligence Platform

> Built for the **ET AI Hackathon** · Problem Statement 5 (PS5) — Citizen Health & Municipal Air Quality Management

---

## 📹 Demo Video

> **[▶ Watch Demo Video](https://drive.google.com/file/d/1Ql9XzMLpin1RF2Da3m8SqzbPT8tnJi-i/view?usp=sharing)**

---

## 🧭 Project Overview

AirSense is a full-stack, AI-powered air quality intelligence platform designed for both municipal authorities and citizens. It ingests real-time pollution data from OpenWeatherMap, runs Indian AQI calculations, forecasts future trends using an ARIMA model, and leverages the **Gemini 2.5 Flash** LLM to deliver:

- Actionable intervention recommendations for city officials
- Personalized health advice for 6 demographic groups
- Auto-generated professional air quality reports
- A conversational AI copilot for ad-hoc queries

---

## 🏗️ Architecture

```
ET AI Hackathon/
├── ai_service/        # Python FastAPI — LLM + OWM data layer (port 8000)
├── backend/           # Spring Boot REST API — data aggregation (port 8080)
├── frontend/          # React + Vite SPA — dashboard UI (port 5173)
├── model/             # ARIMA model pickle (arima.pkl)
├── data/              # Historical AQI datasets
├── .env               # 🔒 Secret API keys (gitignored)
├── .env.example       # Template — copy to .env and fill in keys
└── start-project.ps1  # One-click launcher for all three services
```

### Service Responsibilities

| Service | Stack | Port | Role |
|---|---|---|---|
| AI Service | Python · FastAPI | `8000` | OWM live data, Indian AQI compute, Gemini LLM endpoints, ARIMA forecast |
| Backend | Java · Spring Boot | `8080` | REST aggregation layer for the frontend |
| Frontend | React · Vite | `5173` | Interactive SPA dashboard |

### Model Training Data

| Dataset | Purpose | Format | Source |
|---|---|---|---|
| Indian Air Quality Dataset (2015–2020) | Used to train the AQI forecast model | CSV | [Kaggle: Air Quality Data in India](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india) |

The historical AQI dataset above is used for model training and validation of the forecast pipeline.

### Time Series Forecasting Model

**Selected Model:** ARIMA(2,0,2)

### Model Selection
- Best model selected using AutoARIMA
- Final configuration: **ARIMA(2,0,2)**
- Number of observations: **1,605**

### Model Performance

| Metric | Value |
|--------|-------:|
| AIC | 15385.238 |
| BIC | 15417.524 |
| Log Likelihood | -7686.619 |

### Diagnostic Tests
- Ljung-Box p-value: **0.95** (Residuals show no significant autocorrelation)
- Jarque-Bera p-value: **< 0.001** (Residuals are not perfectly normally distributed)
- Heteroskedasticity p-value: **0.15** (No significant heteroskedasticity)

---

## ✨ Features

| Page | Description |
|---|---|
| **Dashboard** | Live AQI, temperature, humidity & wind speed from OpenWeatherMap |
| **Forecast** | 5-day AQI forecast (ARIMA model + OWM fallback) with per-day weather |
| **Source Analysis** | Pollutant-weighted attribution pie chart + interactive hotspot map (Leaflet) |
| **Recommendations** | Gemini AI action plans for municipal intervention (markdown rendered) |
| **Citizen Health** | Personalized health advice by demographic group, powered by Gemini |
| **Reports** | Auto-generated professional municipal air quality reports via Gemini |
| **AI Copilot** | Conversational chat interface backed by Gemini 2.5 Flash |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Python | ≥ 3.10 |
| Java / Maven | JDK 17 + Maven 3 |

### 1. Clone & configure secrets

```bash
git clone <repo-url>
cd "ET AI Hackathon"

# Copy the env template and fill in your keys
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
```

### 2. Set up the AI Service (Python)

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Launch everything

From the **project root**, run the one-click PowerShell launcher:

```powershell
.\start-project.ps1
```

This opens three terminal windows:
- **AI Service** → `http://localhost:8000`
- **Spring Boot Backend** → `http://localhost:8080`
- **React Frontend** → `http://localhost:5173`

---

## 🔑 Demo Credentials

For easy testing/demonstration, the following credentials are pre-configured:

| Field | Value |
|---|---|
| **Email** | `suraj@gmail.com` |
| **Password** | `suraj` |

---

## 🔒 Security & Secrets

API keys are stored in the **`.env` file at the project root** and are **never committed** to git.

```
.env          ← real keys, gitignored ✅
.env.example  ← safe template, committed ✅
api_key.txt   ← legacy, gitignored ✅
```

The AI service loads keys with `python-dotenv`:
```python
from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env")
gemini_api_key = os.getenv("GEMINI_API_KEY")
owm_api_key    = os.getenv("OPENWEATHERMAP_API_KEY")
```

---

## 🤖 AI & Data Pipeline

```
OpenWeatherMap API
       │
       ▼
  ai_service/app.py
  ├── fetch_owm_weather()          → temp, humidity, wind
  ├── fetch_owm_air_pollution()    → PM2.5, PM10, NO2, O3, SO2, CO
  ├── compute_indian_aqi()         → CPCB sub-index method
  └── ARIMA model                  → 5-day AQI forecast
       │
       ▼
  Gemini 2.5 Flash LLM
  ├── /llm/recommendations         → municipal action plan
  ├── /llm/health-advisor          → demographic health advice
  ├── /llm/report                  → full municipal report
  └── /llm/copilot                 → conversational chat
```

---

## 📦 Key Dependencies

### AI Service (Python)
- `fastapi` — REST API framework
- `google-generativeai` — Gemini LLM SDK
- `python-dotenv` — `.env` file loading
- `requests` — OpenWeatherMap HTTP calls
- `pmdarima` — ARIMA time-series model

### Frontend (React)
- `react-markdown` + `remark-gfm` — renders Gemini markdown output
- `recharts` — AQI charts and graphs
- `react-leaflet` — interactive hotspot map
- `framer-motion` — UI animations
- `axios` — HTTP client

---

## 📄 License

This project was built for the ET AI Hackathon and is intended for demonstration purposes.
