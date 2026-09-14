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

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/mhdhamka/MEIS.git

cd MEIS
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

# Built With

<div align="center">

**Python · FastAPI · React · PostgreSQL · Pandas · Leaflet · Chart.js · Tailwind CSS**

</div>

---

<div align="center">

### 🇲🇾 Built to explore Malaysia through data.

**MEIS — Malaysia Electoral Intelligence System**

Developed by **[@mhdhamka](https://github.com/mhdhamka)**

<br />

 **If you find MEIS interesting, consider giving the repository a star.**

</div>
