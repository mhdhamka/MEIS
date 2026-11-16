# Data Engineering Documentation

This document outlines the data engineering pipeline for the **Malaysia Election Intelligence System (MEIS)**. The pipeline handles data ingestion from source repositories, cleaning and transformation via Python and Pandas, and relational loading into a PostgreSQL database.

---

## Project Directory Structure

```text
meis/
├── data_engineering/
│   ├── cleaning/
│   │   └── clean_election_data.py
│   ├── ingestion/
│   │   └── ingest_election_data.py
│   ├── loading/
│   │   └── load_election_data.py
│   └── pipelines/
│       └── pipeline.py
├── data/
│   ├── datasets/
│   │   ├── consol_ballots.csv
│   │   └── consol_stats.csv
│   ├── processed/
│   │   └── election_results_clean.csv
│   └── raw/
│       ├── constituencies/
│       │   └── all.json
│       ├── elections/
│       │   ├── raw_ballots.csv
│       │   └── raw_stats.csv
│       └── lookups/
│           ├── lookup_candidate.csv
│           ├── lookup_coalition.csv
│           ├── lookup_coalition_succession.csv
│           ├── lookup_dates.csv
│           ├── lookup_party.csv
│           ├── lookup_party_succession.csv
│           └── lookup_prk.csv
└── database/
    ├── schema.sql
    └── seed.sql

```

---

## Pipeline Architecture & Workflow

The data pipeline operates on an **Extract, Transform, Load (ETL)** architecture:

```text
[External GitHub Sources] 
        │
        ▼ (1. Ingestion)
[data/raw/ & data/datasets/] 
        │
        ▼ (2. Cleaning & Transformation via Pandas)
[data/processed/election_results_clean.csv] 
        │
        ▼ (3. Database Loading)
[PostgreSQL Database: malaysia_election_intelligence]

```

---

### Phase 1: Data Ingestion (`ingestion/ingest_election_data.py`)

* **Purpose**: Automates the download of consolidated raw ballot and statistics files from external version-controlled data repositories.
* **Data Sources**: Fetches data programmatically from the open-source Malaysian Election Corpus (MECo) research repository via GitHub ([https://github.com/Thevesh/paper-meco-results](https://github.com/Thevesh/paper-meco-results)).
* **Key Actions**:
* Creates necessary local directories (`data/raw` and `data/datasets`).
* Fetches `consol_ballots.csv` and `consol_stats.csv` via HTTP requests.
* Backs up and mirrors raw files into local staging folders for downstream processing.


### Phase 2: Data Cleaning & Transformation (`cleaning/clean_election_data.py`)

* **Purpose**: Parses raw files, standardizes formats, handles anomalies, and extracts analytical features using Pandas.

* **Key Steps**:
* **Column Normalization**: Strips whitespace, converts headers to lowercase, and replaces spaces with underscores (`_`).
* **Text & Date Formatting**: Cleans string formatting across attributes (election names, states, seats, candidates, parties) and casts date formats with error coercion.
* **Numeric Processing**: Converts votes, vote percentages, ballot order, and ages into standard numeric types.
* **Deduplication & Validation**: Drops exact duplicate rows and validates integrity constraints (e.g., flagging negative votes or percentage bounds outside 0–100%).
* **Feature Engineering**: Adds derived columns such as `seat_type` (distinguishing *Parliament* vs. *State Assembly* based on prefix codes `P.` or `N.`) and extracts `election_year`.
* **Output**: Exports the sanitized dataset to `data/processed/election_results_clean.csv`.


### Phase 3: Relational Database Loading (`loading/load_election_data.py`)

* **Purpose**: Ingests the cleaned CSV dataset into a structured relational PostgreSQL database using `psycopg2`.

* **Loading Order (Dependency Management)**:
1. **`states`**: Extracts and loads unique administrative states.
2. **`parties`**: Extracts and loads unique political parties.
3. **`elections`**: Maps election metadata and categorizes types (*General Election*, *State Election*, *By-Election*).
4. **`seats`**: Parses constituency codes and names, linking them back to their respective `state_id`.
5. **`candidates`**: Registers individual candidates and links them to their contesting seats and affiliations.
6. **`election_results`**: Inserts granular records connecting elections, seats, candidates, parties, vote totals, and win/loss status.

---

## Database Schema Reference (`database/schema.sql`)

The underlying PostgreSQL database enforces strict relational integrity using foreign keys and cascade rules:
* **`states`**: Stores unique state entries (`state_id`, `state_name`).
* **`parties`**: Stores distinct political entities (`party_id`, `party_name`).
* **`elections`**: Tracks election cycles (`election_id`, `election_name`, `election_year`, `election_type`).
* **`seats`**: Tracks electoral boundaries (`seat_id`, `seat_code`, `seat_name`, `seat_type`, `state_id`).
* **`candidates`**: Tracks running politicians (`candidate_id`, `candidate_uid`, `candidate_name`, `party_id`, `seat_id`).
* **`election_results`**: Core facts table for votes and percentages (`result_id`, `election_id`, `seat_id`, `candidate_id`, `party_id`, `total_votes`, `vote_percentage`, `result_status`).