## MEIS Three Layer System?

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
