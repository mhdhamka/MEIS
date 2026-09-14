<div align="center">

# 🇲🇾 Malaysia Electoral Intelligence System (MEIS)

**An open electoral intelligence platform for exploring Malaysian parliamentary and state assembly elections through structured data, interactive geospatial analysis, historical trends, and automated data pipelines.**

<br />

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Pandas](https://img.shields.io/badge/Pandas-ETL-150458?style=for-the-badge\&logo=pandas\&logoColor=white)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

**[Explore MEIS](./docs/Explore-MEIS.md) · [Documentation](./docs/Documentation.md) · [Architecture](./docs/Architecture.md) · [API](./docs/API.md) · [Report a Bug](../../issues) · [Request a Feature](../../issues)**

</div>

---

## What is MEIS?

**Malaysia Electoral Intelligence System (MEIS)** is a data-driven platform designed to transform fragmented Malaysian electoral data into an interactive intelligence workspace.

Instead of treating election results as static tables, MEIS connects **constituencies, candidates, parties, states, election cycles, vote counts, margins, and geographic information** into a unified analytical system.

The platform is designed around three layers:

```text
                 ┌──────────────────────────┐
                 │      MEIS FRONTEND       │
                 │  Dashboards • Maps • UI  │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │       MEIS API           │
                 │ FastAPI • Services • ORM │
                 └────────────┬─────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐   ┌──────────────────┐
          │  DATA PIPELINE  │   │    DATABASE      │
          │ Pandas • ETL    │   │ PostgreSQL       │
          │ Clean • Transform│  │ Electoral Data   │
          └────────┬────────┘   └─────────┬────────┘
                   │                      │
                   └──────────┬───────────┘
                              ▼
                    ┌──────────────────┐
                    │ ELECTORAL DATA   │
                    │ Raw → Processed  │
                    │ → Analytical     │
                    └──────────────────┘
```

> **MEIS is not simply an election results viewer. It is an analytical infrastructure for Malaysian electoral data.**

---

# Data Architecture

MEIS uses a normalized relational structure to connect electoral entities across multiple election cycles.

```text
                         ┌─────────────┐
                         │    STATE    │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
             ┌─────────────┐        ┌─────────────┐
             │ PARLIAMENT  │        │     DUN      │
             └──────┬──────┘        └──────┬──────┘
                    │                      │
                    └──────────┬───────────┘
                               ▼
                     ┌──────────────────┐
                     │ CONSTITUENCY     │
                     └────────┬─────────┘
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                ┌────────────┐ ┌────────────┐
                │ CANDIDATE  │ │   PARTY    │
                └──────┬─────┘ └──────┬─────┘
                       │              │
                       └──────┬───────┘
                              ▼
                    ┌──────────────────┐
                    │ ELECTION RESULT  │
                    └──────────────────┘
```

This structure allows MEIS to answer questions such as:

> Who won this constituency?

> How did the winning margin change?

> Which party performed best across a state?

> How has a constituency changed between election cycles?

---

# Automated Data Engineering

MEIS treats electoral data as a **pipeline**, not a manually maintained spreadsheet.

```text
          RAW DATA
             │
             ▼
      ┌──────────────┐
      │   INGESTION  │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │    CLEANING  │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │ NORMALIZATION│
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │ VALIDATION   │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │   LOADING    │
      └──────┬───────┘
             │
             ▼
        PostgreSQL
             │
             ▼
        FastAPI API
             │
             ▼
       MEIS Frontend
```

### Pipeline responsibilities

| Stage              | Responsibility                                             |
| :----------------- | :--------------------------------------------------------- |
| **Ingestion**      | Import raw electoral datasets                              |
| **Cleaning**       | Remove inconsistencies and malformed records               |
| **Normalization**  | Standardize states, parties, candidates and constituencies |
| **Validation**     | Detect invalid or conflicting records                      |
| **Transformation** | Generate analytical datasets                               |
| **Loading**        | Persist validated data into the relational database        |

---

# Live System Telemetry

MEIS treats the interface itself as an operational workspace.

The dashboard can surface:

```text
┌─────────────────────────────────────────────┐
│ MEIS SYSTEM STATUS                          │
├─────────────────────────────────────────────┤
│                                             │
│ API STATUS             ● OPERATIONAL        │
│ DATABASE               ● CONNECTED          │
│ DATA PIPELINE          ● READY              │
│                                             │
│ API LATENCY             42 ms               │
│ DATA RECORDS            128,421             │
│ LAST PIPELINE RUN       14:32:08            │
│ SYSTEM UPTIME           99.98%              │
│                                             │
└─────────────────────────────────────────────┘
```

This provides visibility into both **data intelligence and system health**.

---

# Tech Stack

| Layer                 | Technology                      |
| :-------------------- | :------------------------------ |
| **Frontend**          | React, JavaScript, Tailwind CSS |
| **Mapping**           | Leaflet.js                      |
| **Charts**            | Chart.js                        |
| **Backend**           | Python, FastAPI, Uvicorn        |
| **Data Engineering**  | Python, Pandas                  |
| **Database**          | PostgreSQL                      |
| **API Architecture**  | REST                            |
| **ORM / Data Access** | SQLAlchemy                      |
| **Icons**             | Lucide Icons                    |
| **Visualization**     | Custom CSS + SVG                |
| **Development**       | Git, GitHub                     |

---

# Project Structure

```text
Malaysia-Election-Intelligence-System/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── maps/
│   │   │   ├── modals/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database/
│   │   └── core/
│   └── requirements.txt
│
├── data/
│   ├── raw/
│   ├── processed/
│   ├── validated/
│   └── datasets/
│
├── data_engineering/
│   ├── cleaning/
│   ├── ingestion/
│   ├── transformation/
│   ├── validation/
│   └── loading/
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── API.md
│   ├── DataDictionary.md
│   ├── SystemDesign.md
│   ├── Architecture.md
│   └── ERD.png
│
├── tests/
│   ├── backend/
│   ├── frontend/
│   └── data/
│
├── .env.example
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# API

MEIS exposes electoral data through a FastAPI REST interface.

### Example endpoints

```http
GET /api/v1/states
GET /api/v1/parliament
GET /api/v1/dun
GET /api/v1/constituencies
GET /api/v1/candidates
GET /api/v1/parties
GET /api/v1/elections
GET /api/v1/results
```

Example request:

```http
GET /api/v1/constituencies/P195/results
```

Example response:

```json
{
  "constituency": "P195",
  "name": "Bandar Kuching",
  "state": "Sarawak",
  "elections": [
    {
      "year": 2022,
      "winner": "Candidate Name",
      "party": "Party Name",
      "votes": 18432,
      "majority": 5231
    }
  ]
}
```

Full API documentation is available in [`docs/API.md`](./docs/API.md).

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/mhdhamka/Malaysia-Election-Intelligence-System.git

cd Malaysia-Election-Intelligence-System
```

---

## 2. Start the backend

```bash
cd backend

python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

API:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

## 3. Start the frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# Development Workflow

MEIS follows a data-first development workflow:

```text
     DATA
       │
       ▼
   VALIDATE
       │
       ▼
   TRANSFORM
       │
       ▼
    DATABASE
       │
       ▼
      API
       │
       ▼
   FRONTEND
       │
       ▼
   ANALYTICS
```

Changes to the data model should propagate through the pipeline rather than being manually duplicated across the application.

---

# Documentation

| Document                                        | Description                               |
| :---------------------------------------------- | :---------------------------------------- |
| [`SystemDesign.md`](./docs/SystemDesign.md)     | Overall system architecture               |
| [`Architecture.md`](./docs/Architecture.md)     | Application & infrastructure architecture |
| [`API.md`](./docs/API.md)                       | REST API reference                        |
| [`DataDictionary.md`](./docs/DataDictionary.md) | Dataset & field definitions               |
| [`ERD.png`](./docs/ERD.png)                     | Database entity relationship diagram      |

---

# Interface Preview

<div align="center">

<img src="./docs/ERD.png" alt="MEIS System Architecture" width="900"/>

**MEIS — Electoral Intelligence Architecture**

</div>

---

# Built With

<div align="center">

**Python · FastAPI · React · PostgreSQL · Pandas · Leaflet · Chart.js · Tailwind CSS**

</div>

---

<div align="center">

### 🇲🇾 Built to explore Malaysia through data.

**MEIS — Malaysia Electoral Intelligence System**

Crafted with ⚡ by **[@mhdhamka](https://github.com/mhdhamka)**

<br />

 **If you find MEIS interesting, consider giving the repository a star.**

</div>
