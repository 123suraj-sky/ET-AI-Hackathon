I think we should design the APIs **before writing a single line of code**. These APIs become the contract between all four team members. Once they're finalized, everyone can work independently.

Also, I would simplify the architecture a little. Instead of many tiny agents, we'll have:

* **ML Service** (Forecast)
* **Environmental Intelligence Service** (Source Attribution + Impact Simulator)
* **LLM Intelligence Service** (Recommendations, Health, Reports, Copilot)
* **Spring Boot Orchestrator** (Later)

---

# Overall API Flow

```text
                    React Dashboard
                           │
                    Spring Boot Backend
                           │
                  AI Orchestrator Service
                           │
      ┌────────────┬──────────────┬──────────────┐
      │            │              │
 Forecast API   Environment API   LLM API
      │            │              │
      └────────────┴──────────────┘
                 PostgreSQL/PostGIS
```

---

# 1. Forecast Service APIs (ML)

Base URL

```
/api/forecast
```

| Method | Endpoint              | Purpose              |
| ------ | --------------------- | -------------------- |
| POST   | `/predict`            | Predict AQI          |
| POST   | `/train`              | Train model          |
| GET    | `/metrics`            | Model evaluation     |
| GET    | `/feature-importance` | Explain model        |
| GET    | `/model-info`         | Model details        |
| POST   | `/batch-predict`      | Multiple predictions |

---

## POST /predict

Input

```json
{
    "city":"Delhi",
    "station":"ITO",
    "timestamp":"2026-07-10T12:00:00",
    "temperature":36,
    "humidity":62,
    "windSpeed":4.5,
    "pm25":142,
    "pm10":190,
    "no2":41,
    "so2":17,
    "co":1.8,
    "o3":32
}
```

Output

```json
{
    "currentAQI":182,
    "predictedAQI24":205,
    "predictedAQI48":221,
    "predictedAQI72":236,
    "trend":"Increasing",
    "confidence":0.94
}
```

---

# 2. Environmental Intelligence APIs

Base URL

```
/api/environment
```

| Method | Endpoint               | Purpose                      |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/source-analysis`     | Pollution source attribution |
| POST   | `/impact-simulation`   | Estimate intervention impact |
| POST   | `/hotspots`            | Identify pollution hotspots  |
| POST   | `/risk-score`          | Calculate ward risk          |
| GET    | `/historical-analysis` | Historical trends            |

---

## POST /source-analysis

Input

```json
{
    "location":"Ward-17",
    "aqi":205,
    "weather":{
        "windSpeed":2.5
    },
    "trafficIndex":81,
    "constructionSites":12,
    "industrialZones":2
}
```

Output

```json
{
    "traffic":46,
    "construction":27,
    "industry":18,
    "wasteBurning":9,
    "confidence":0.89
}
```

---

## POST /impact-simulation

Input

```json
{
    "currentAQI":220,
    "actions":[
        "Restrict Trucks",
        "Suspend Construction"
    ]
}
```

Output

```json
{
    "expectedAQI":184,
    "improvement":16.3,
    "confidence":0.84
}
```

---

# 3. LLM Intelligence APIs

Base URL

```
/api/ai
```

| Method | Endpoint           | Purpose                |
| ------ | ------------------ | ---------------------- |
| POST   | `/recommendation`  | Generate interventions |
| POST   | `/health-advisory` | Citizen guidance       |
| POST   | `/copilot`         | Officer Q&A            |
| POST   | `/generate-report` | AI report              |
| POST   | `/summarize`       | Daily summary          |

---

## POST /recommendation

Input

```json
{
    "forecastAQI":236,
    "sources":{
        "traffic":46,
        "construction":27,
        "industry":18,
        "wasteBurning":9
    }
}
```

Output

```json
{
    "recommendations":[
        {
            "priority":1,
            "action":"Restrict diesel trucks",
            "expectedReduction":"12%"
        },
        {
            "priority":2,
            "action":"Suspend construction",
            "expectedReduction":"8%"
        }
    ]
}
```

---

## POST /health-advisory

Input

```json
{
    "aqi":236,
    "language":"English",
    "target":"Children"
}
```

Output

```json
{
    "risk":"High",
    "advisory":"Avoid outdoor sports..."
}
```

---

## POST /copilot

Input

```json
{
    "question":"Why is AQI increasing in Ward 17?"
}
```

Output

```json
{
    "answer":"Traffic congestion combined with nearby construction..."
}
```

---

## POST /generate-report

Output

```json
{
    "reportId":"RPT-001",
    "downloadUrl":"/reports/RPT-001.pdf"
}
```

---

# 4. Backend APIs (Spring Boot)

These will be implemented after the AI services are complete.

```
/api/auth
```

* POST /login
* POST /logout

---

```
/api/dashboard
```

* GET /overview
* GET /city
* GET /ward
* GET /heatmap
* GET /analytics

---

```
/api/map
```

* GET /layers
* GET /stations
* GET /hospitals
* GET /schools
* GET /roads

---

```
/api/user
```

* GET /profile
* PUT /profile

---

```
/api/report
```

* GET /download/{id}
* GET /history

---

# Complete Flow

```
Dashboard

↓

Forecast API

↓

Source Attribution API

↓

Recommendation API

↓

Impact Simulation API

↓

Health Advisory API

↓

Generate Report API

↓

Dashboard Response
```

---

