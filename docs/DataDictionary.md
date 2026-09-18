```markdown
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
| --- | --- | --- | --- | --- | --- | --- |
| `state_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique identifier for the state |
| `state_name`<br> | `varchar(100)`<br> | —

 | No

 | —

 | —

 | Official name of the state or federal territory |

---

### Table 2: `seats`

Stores electoral districts or constituencies.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| --- | --- | --- | --- | --- | --- | --- |
| `seat_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique identifier for the seat |
| `seat_code`<br> | `varchar(20)`<br> | —

 | No

 | —

 | —

 | Official alphanumeric code/abbreviation (e.g., P.192) |
| `seat_name`<br> | `varchar(150)`<br> | —

 | No

 | —

 | —

 | Formal name of the constituency |
| `seat_type`<br> | `enum('Parliament', 'State Assembly')`<br> | —

 | No

 | —

 | —

 | Classification of the legislative level |
| `state_id`<br> | `int(11)`<br> | Foreign Key

 | No

 | —

 | —

 | Links to `states.state_id` (CASCADE)

 |

---

### Table 3: `parties`

Stores registered political parties.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| --- | --- | --- | --- | --- | --- | --- |
| `party_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique identifier for the political party |
| `party_name`<br> | `varchar(150)`<br> | —

 | No

 | —

 | —

 | Official registered name of the political party |

---

### Table 4: `candidates`

Stores individual candidates contesting elections.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| --- | --- | --- | --- | --- | --- | --- |
| `candidate_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique system identifier for the candidate |
| `candidate_uid`<br> | `varchar(100)`<br> | —

 | Yes

 | `NULL`<br> | —

 | External dataset tracking or national identity reference code |
| `candidate_name`<br> | `varchar(255)`<br> | —

 | No

 | —

 | —

 | Full legal name of the candidate |
| `party_id`<br> | `int(11)`<br> | Foreign Key

 | Yes

 | `NULL`<br> | —

 | Links to `parties.party_id` (SET NULL)

 |
| `seat_id`<br> | `int(11)`<br> | Foreign Key

 | No

 | —

 | —

 | Links to `seats.seat_id` (CASCADE)

 |

---

### Table 5: `elections`

Stores metadata regarding election cycles.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| --- | --- | --- | --- | --- | --- | --- |
| `election_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique identifier for the election event |
| `election_name`<br> | `varchar(100)`<br> | —

 | No

 | —

 | —

 | Descriptive name (e.g., "15th General Election") |
| `election_year`<br> | `int(11)`<br> | —

 | No

 | —

 | —

 | Calendar year of the election |
| `election_type`<br> | `varchar(50)`<br> | —

 | No

 | —

 | —

 | Classification (e.g., General Election, State Election) |

---

### Table 6: `election_results`

Stores detailed vote counts and outcome outcomes per candidate per contest.

| Column | Type | Attributes | Null | Default | Extra | Links to / Comments |
| --- | --- | --- | --- | --- | --- | --- |
| `result_id`<br> | `int(11)`<br> | Primary Key

 | No

 | —

 | auto increment

 | Unique record identifier |
| `election_id`<br> | `int(11)`<br> | Foreign Key

 | No

 | —

 | —

 | Links to `elections.election_id` (CASCADE)

 |
| `seat_id`<br> | `int(11)`<br> | Foreign Key

 | No

 | —

 | —

 | Links to `seats.seat_id` (CASCADE)

 |
| `candidate_id`<br> | `int(11)`<br> | Foreign Key

 | No

 | —

 | —

 | Links to `candidates.candidate_id` (CASCADE)

 |
| `party_id`<br> | `int(11)`<br> | Foreign Key

 | Yes

 | `NULL`<br> | —

 | Links to `parties.party_id` (SET NULL)

 |
| `total_votes`<br> | `int(11)`<br> | —

 | No

 | `0`<br> | —

 | Aggregate votes garnered by the candidate |
| `vote_percentage`<br> | `decimal(8,4)`<br> | —

 | Yes

 | `NULL`<br> | —

 | Proportion of popular votes secured in the seat |
| `result_status`<br> | `varchar(50)`<br> | —

 | Yes

 | `NULL`<br> | —

 | Outcome indicator (e.g., Won, Lost) |

```

```