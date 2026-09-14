

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
