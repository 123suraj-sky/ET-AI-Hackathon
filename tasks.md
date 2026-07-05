# Suraj

This is the most critical role.

## Responsibilities

### Architecture

* Finalize HLD
* LLD
* AI architecture
* Microservice communication
* API contracts
* Database schema
* Folder structure

---

### Data Engineering

Collect all datasets

* AQI
* Weather
* Traffic
* OpenStreetMap
* Hospitals
* Schools
* Population
* Ward boundaries

Build

* Data cleaning pipeline
* Feature preparation
* Merge datasets
* GeoJSON generation

---

### GIS

* PostGIS design
* Heatmap generation
* Ward boundaries
* Spatial joins
* GeoJSON APIs

---

### Integration

After everyone finishes

Integrate

* Backend
* ML
* Gemini
* Frontend

---

### DevOps

* Docker
* Deployment
* GitHub
* CI (optional)
* PPT
* Demo
* Architecture diagram

---

**Deliverables**

* Architecture
* Database
* Data pipeline
* GIS
* Integration
* Deployment

---

# Tilak

Owns the complete Spring Boot application.

Responsibilities

* Spring Boot
* PostgreSQL
* JWT
* Authentication
* REST APIs
* AI Orchestrator
* Repository
* DTOs
* Services
* Swagger
* API Gateway

Internal REST clients

```text
Forecast Service

↓

Environment Service

↓

LLM Service
```

Deliverables

* Complete backend

---

# Omkar

Instead of only

> Train model

Own

## ML

* Dataset
* Cleaning
* Feature engineering
* XGBoost
* Evaluation
* Model serialization

AND

## Environmental Intelligence

* Source Attribution
* Hotspot Detection
* Confidence Score
* Impact Simulator

These naturally fit together because they use the same environmental datasets.

Deliverables

* Forecast Service
* Environment Service

---

# Bharti

Own everything user-facing.

## Gemini

* Recommendation Engine
* Health Advisor
* AI Copilot
* Report Generator

## Frontend

* React
* Dashboard
* Leaflet
* Charts
* API Integration
* Responsive UI

Deliverables

* LLM Service
* Dashboard

---

# Final Ownership

| Module                | Owner             |
| --------------------- | ----------------- |
| System Architecture   | **Suraj**         |
| Data Collection       | **Suraj**         |
| Data Pipeline         | **Suraj**         |
| GIS / GeoJSON         | **Suraj**         |
| Spring Boot Backend   | **Tilak**         |
| Database Integration  | **Tilak**         |
| Authentication        | **Tilak**         |
| API Gateway           | **Tilak**         |
| AQI Forecast Model    | **Omkar**         |
| Source Attribution    | **Omkar**         |
| Impact Simulator      | **Omkar**         |
| Gemini Integration    | **Bharti**        |
| Recommendation Engine | **Bharti**        |
| AI Copilot            | **Bharti**        |
| React Dashboard       | **Bharti**        |
| Final Integration     | **Suraj + Tilak** |
| Deployment            | **Suraj + Tilak** |
| PPT & Demo            | **Everyone**      |

---

# Workload Balance

| Member | Difficulty | Workload |
| ------ | ---------- | -------- |
| Suraj  | ⭐⭐⭐⭐⭐      | 25%      |
| Tilak  | ⭐⭐⭐⭐⭐      | 25%      |
| Omkar  | ⭐⭐⭐⭐☆      | 25%      |
| Bharti | ⭐⭐⭐⭐☆      | 25%      |

This is much closer to balanced than the previous split.

---

# One thing I'd change even further (my recommendation)

Instead of waiting until the end to integrate, I'd introduce **integration milestones**:

### Milestone 1 (Day 2)

* Suraj provides cleaned datasets and API contracts.
* Omkar returns a working `/forecast` endpoint (even if it's using a basic model).
* Bharti returns a `/recommendation` endpoint with a simple Gemini prompt.
* Tilak connects these through the Spring Boot orchestrator using mock responses if necessary.

### Milestone 2

Replace mocks with real implementations.

### Milestone 3

Connect the React dashboard.

This way, by the middle of the hackathon you already have an end-to-end working system, and the remaining time is spent improving accuracy and polish instead of scrambling to integrate everything at the last minute.

**I genuinely think this is the strongest team structure** because:

* Everyone owns a complete domain rather than scattered tasks.
* Suraj (you) leads architecture and integration instead of being buried in one module.
* Tilak focuses on backend engineering.
* Omkar focuses on data science and environmental intelligence.
* Bharti focuses on AI interactions and the user experience.
