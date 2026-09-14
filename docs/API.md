# API Reference

MEIS exposes comprehensive electoral data and analytics through a FastAPI REST interface.

Base URL: `http://localhost:8000/api/v1`

---

## Endpoint Summary

| Route Group | Base Path | Description |
| :--- | :--- | :--- |
| **Elections** | `/api/v1/elections` | Election cycles, metadata, and summaries |
| **Parties** | `/api/v1/parties` | Registered political parties and directories |
| **States** | `/api/v1/states` | Malaysian states and regional groupings |
| **Seats** | `/api/v1/seats` | Parliamentary and DUN constituency metadata |
| **Candidates** | `/api/v1/candidates` | Candidate profiles, stats, and histories |
| **Results** | `/api/v1/results` | Raw and filtered electoral vote results |
| **Analytics** | `/api/v1/analytics` | Advanced aggregated intelligence and metrics |
| **Map** | `/api/v1/map` | Geospatial and map-specific query endpoints |
| **System** | `/health` / Root | Telemetry, pipeline logs, and system status |

---

## 1. Elections (`/api/v1/elections`)

* `GET /api/v1/elections` — Retrieve all recorded election cycles.
* `GET /api/v1/elections/{election_id}` — Get a single election profile by ID.

---

## 2. Constituencies & Seats (`/api/v1/seats` & `/api/v1/analytics/constituencies`)

* `GET /api/v1/seats` — Get all seats, with optional filtering by `seat_type` or `state_id`.
* `GET /api/v1/analytics/constituencies` — Filterable, paginated directory of constituencies with winner details and margins.
* `GET /api/v1/analytics/constituencies/{seat_id}` — Deep profile view for a specific constituency, including candidates, history, and stats.

---

## 3. Candidates (`/api/v1/candidates`)

* `GET /api/v1/candidates` — Paginated list of candidates with optional filters for `seat_id`, `party_id`, `election_id`, and `state`.

---

## 4. Parties (`/api/v1/parties`)

* `GET /api/v1/parties` — List all political parties.
* `GET /api/v1/parties/{party_id}` — Get details for a specific party.

---

## 5. States (`/api/v1/states`)

* `GET /api/v1/states` — List all states.
* `GET /api/v1/states/{state_id}` — Get details for a specific state.

---

## 6. Results (`/api/v1/results`)

* `GET /api/v1/results` — Flexible query endpoint for voting results, filterable by `election_id`, `seat_id`, or `party_id`.

---

## 7. Map & Geospatial (`/api/v1/map`)

* `GET /api/v1/map/results` — Purpose-built endpoint for the frontend map layer. Returns a lightweight, one-row-per-seat analytical payload (winner, vote share, margin) to merge directly with cached GeoJSON data.

---

## 8. Analytics (`/api/v1/analytics`)

* `GET /api/v1/analytics/overview` — High-level system counts (states, parties, seats, candidates, elections, total votes).
* `GET /api/v1/analytics/election-summary` — Turnout, total votes, and summary for an election cycle.
* `GET /api/v1/analytics/historical-trends` — Historical breakdown across election cycles.
* `GET /api/v1/analytics/party-performance` — Party seat counts, vote totals, and vote shares.
* `GET /api/v1/analytics/seat-counts` — Seat distribution won by each party.
* `GET /api/v1/analytics/state-performance` — State-level electoral turnout and participation metrics.
* `GET /api/v1/analytics/winning-margins` — Constituency-by-constituency winning margin analysis.
* `GET /api/v1/analytics/election-comparison` — Cross-cycle historical comparison for seats.
* `GET /api/v1/analytics/intelligence-alerts` — System warnings (e.g., razor-thin winning margins < 500 votes).
* `GET /api/v1/analytics/pipeline-logs` — Automated data engineering pipeline status logs.

---

## 9. System Telemetry

* `GET /` — Root verification endpoint.
* `GET /health` — Service health check.

---

### Example Request

```http
GET /api/v1/analytics/constituencies/195

```

### Example Response

```json
{
  "data": {
    "seat_id": 195,
    "seat_code": "P.195",
    "seat_name": "Bandar Kuching",
    "seat_type": "Parliament",
    "state_name": "Sarawak",
    "winner_party": "Democratic Action Party",
    "winner_votes": 18432,
    "vote_share": 78.4,
    "margin": 5231,
    "turnout": 74.7,
    "candidates": [
      {
        "candidate_id": 401,
        "candidate_name": "Dr. Kelvin Yii",
        "party_name": "Democratic Action Party",
        "total_votes": 18432,
        "result_status": "WINNER"
      }
    ],
    "history": [
      {
        "year": 2022,
        "winner_party": "Democratic Action Party",
        "votes": 18432,
        "margin": 5231
      }
    ]
  }
}

```
