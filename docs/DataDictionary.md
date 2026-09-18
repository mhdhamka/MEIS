# Data Dictionary & Database Architecture: MEIS (Malaysia Election Intelligence System)

## 1. Architectural Roadmap & Technology Stack

* **Current State:** MySQL (utilized for early database schemas, data engineering ingestion pipelines, backend endpoints, and frontend integration).
* **Future Target State:** PostgreSQL (planned migration scheduled after all core project modules—data engineering, SQL schemas, backend endpoints, and frontend user interfaces—are fully completed, tested, and stabilized).

---

## 2. Entity-Relationship Diagram (ERD) Textual Layout

```text
+-------------------+       +-------------------+       +-------------------+
|      states       |       |       seats       |       |      parties      |
+-------------------+       +-------------------+       +-------------------+
| PK state_id       |<------| PK  seat_id       |       | PK  party_id      |
|    state_name     |       |     seat_code     |       |     party_name    |
+-------------------+       |     seat_name     |       +-------------------+
                            |     seat_type     |                 ^
                            | FK  state_id      |                 |
                            +-------------------+                 |
                                      ^                           |
                                      |                           |
                            +-------------------+                 |
                            |    candidates     |                 |
                            +-------------------+                 |
                            | PK  candidate_id  |                 |
                            |     candidate_uid |                 |
                            |     candidate_name|                 |
                            | FK  party_id      |-----------------+
                            | FK  seat_id       |
                            +-------------------+
                                      ^
                                      |
+-------------------+                 |
|     elections     |                 |
+-------------------+                 |
| PK election_id    |                 |
|    election_name  |                 |
|    election_year  |                 |
|    election_type  |                 |
+-------------------+                 |
          ^                           |
          |                           |
          +-------------------------------------------------+
                                      |                     |
                            +-------------------------------+
                            |       election_results        |
                            +-------------------------------+
                            | PK  result_id                 |
                            | FK  election_id               |
                            | FK  seat_id                   |
                            | FK  candidate_id              |
                            | FK  party_id                  |
                            |     total_votes               |
                            |     vote_percentage           |
                            |     result_status             |
                            +-------------------------------+

```

---

## 3. Core Relational Schema & Data Dictionary

### Table 1: `states`

Stores high-level state or territory entities.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `state_id` | `int(11)` | Primary Key | No | — | auto increment | Unique identifier for the state |
| `state_name` | `varchar(100)` | — | No | — | — | Official name of the state or federal territory |

---

### Table 2: `seats`

Stores electoral districts or constituencies.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `seat_id` | `int(11)` | Primary Key | No | — | auto increment | Unique identifier for the seat |
| `seat_code` | `varchar(20)` | — | No | — | — | Official alphanumeric code/abbreviation (e.g., P.192) |
| `seat_name` | `varchar(150)` | — | No | — | — | Formal name of the constituency |
| `seat_type` | `enum('Parliament', 'State Assembly')` | — | No | — | — | Classification of the legislative level |
| `state_id` | `int(11)` | Foreign Key | No | — | — | Links to `states.state_id` (CASCADE) |

---

### Table 3: `parties`

Stores registered political parties.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `party_id` | `int(11)` | Primary Key | No | — | auto increment | Unique identifier for the political party |
| `party_name` | `varchar(150)` | — | No | — | — | Official registered name of the political party |

---

### Table 4: `candidates`

Stores individual candidates contesting elections.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `candidate_id` | `int(11)` | Primary Key | No | — | auto increment | Unique system identifier for the candidate |
| `candidate_uid` | `varchar(100)` | — | Yes | `NULL` | — | External dataset tracking or national identity reference code |
| `candidate_name` | `varchar(255)` | — | No | — | — | Full legal name of the candidate |
| `party_id` | `int(11)` | Foreign Key | Yes | `NULL` | — | Links to `parties.party_id` (SET NULL) |
| `seat_id` | `int(11)` | Foreign Key | No | — | — | Links to `seats.seat_id` (CASCADE) |

---

### Table 5: `elections`

Stores metadata regarding election cycles.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `election_id` | `int(11)` | Primary Key | No | — | auto increment | Unique identifier for the election event |
| `election_name` | `varchar(100)` | — | No | — | — | Descriptive name (e.g., "15th General Election") |
| `election_year` | `int(11)` | — | No | — | — | Calendar year of the election |
| `election_type` | `varchar(50)` | — | No | — | — | Classification (e.g., General Election, State Election) |

---

### Table 6: `election_results`

Stores detailed vote counts and outcome outcomes per candidate per contest.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `result_id` | `int(11)` | Primary Key | No | — | auto increment | Unique record identifier |
| `election_id` | `int(11)` | Foreign Key | No | — | — | Links to `elections.election_id` (CASCADE) |
| `seat_id` | `int(11)` | Foreign Key | No | — | — | Links to `seats.seat_id` (CASCADE) |
| `candidate_id` | `int(11)` | Foreign Key | No | — | — | Links to `candidates.candidate_id` (CASCADE) |
| `party_id` | `int(11)` | Foreign Key | Yes | `NULL` | — | Links to `parties.party_id` (SET NULL) |
| `total_votes` | `int(11)` | — | No | `0` | — | Aggregate votes garnered by the candidate |
| `vote_percentage` | `decimal(8,4)` | — | Yes | `NULL` | — | Proportion of popular votes secured in the seat |
| `result_status` | `varchar(50)` | — | Yes | `NULL` | — | Outcome indicator (e.g., Won, Lost) |
