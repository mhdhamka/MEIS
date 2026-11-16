from pathlib import Path
import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "election_results_clean.csv"
)

# Uses environment variable for cloud Postgres (Neon/Supabase) or falls back to local
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/malaysia_election_intelligence"
)


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():
    return psycopg2.connect(DATABASE_URL)


# ============================================================
# HELPERS
# ============================================================

def clean_value(value):

    if pd.isna(value):
        return None

    value = str(value).strip()

    if value == "":
        return None

    return value


def split_seat(seat):

    seat = clean_value(seat)

    if not seat:
        return None, None

    parts = seat.split(" ", 1)

    if len(parts) == 2:
        return parts[0], parts[1]

    return seat, seat


# ============================================================
# LOAD STATES
# ============================================================

def load_states(cursor, df):

    print("\n[1/6] Loading states...")

    states = (
        df["state"]
        .dropna()
        .astype(str)
        .str.strip()
        .drop_duplicates()
    )

    query = """
        INSERT INTO states
        (state_name)
        VALUES (%s)
        ON CONFLICT (state_name) DO NOTHING
    """

    count = 0

    for state in states:

        cursor.execute(
            query,
            (state,)
        )

        count += 1

    print(f"[OK] States processed: {count}")


# ============================================================
# LOAD PARTIES
# ============================================================

def load_parties(cursor, df):

    print("\n[2/6] Loading parties...")

    parties = (
        df["party"]
        .dropna()
        .astype(str)
        .str.strip()
        .drop_duplicates()
    )

    query = """
        INSERT INTO parties
        (party_name)
        VALUES (%s)
        ON CONFLICT (party_name) DO NOTHING
    """

    count = 0

    for party in parties:

        if not party:
            continue

        cursor.execute(
            query,
            (party,)
        )

        count += 1

    print(f"[OK] Parties processed: {count}")


# ============================================================
# LOAD ELECTIONS
# ============================================================

def load_elections(cursor, df):

    print("\n[3/6] Loading elections...")

    elections = (
        df[
            [
                "election",
                "election_year"
            ]
        ]
        .dropna(subset=["election"])
        .drop_duplicates()
    )

    query = """
        INSERT INTO elections
        (
            election_name,
            election_year,
            election_type
        )
        VALUES (%s, %s, %s)
        ON CONFLICT (election_name, election_year) DO NOTHING
    """

    count = 0

    for _, row in elections.iterrows():

        election_name = clean_value(
            row["election"]
        )

        election_year = (
            int(row["election_year"])
            if not pd.isna(row["election_year"])
            else None
        )

        if not election_name:
            continue

        election_upper = election_name.upper()

        if election_upper.startswith("GE"):
            election_type = "General Election"

        elif election_upper.startswith("PRN"):
            election_type = "State Election"

        elif election_upper.startswith("PRK"):
            election_type = "By-Election"

        else:
            election_type = "Other"

        cursor.execute(
            query,
            (
                election_name,
                election_year,
                election_type
            )
        )

        count += 1

    print(f"[OK] Elections processed: {count}")


# ============================================================
# LOAD SEATS
# ============================================================

def load_seats(cursor, df):

    print("\n[4/6] Loading seats...")

    seats = (
        df[
            [
                "seat",
                "state",
                "seat_type"
            ]
        ]
        .dropna(subset=["seat", "state"])
        .drop_duplicates()
    )

    query = """
        INSERT INTO seats
        (
            seat_code,
            seat_name,
            seat_type,
            state_id
        )
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (seat_code, seat_name) DO NOTHING
    """

    count = 0

    for _, row in seats.iterrows():

        seat_code, seat_name = split_seat(
            row["seat"]
        )

        state_name = clean_value(
            row["state"]
        )

        seat_type = clean_value(
            row["seat_type"]
        )

        # Find state
        cursor.execute(
            """
            SELECT state_id
            FROM states
            WHERE state_name = %s
            """,
            (state_name,)
        )

        state = cursor.fetchone()

        if not state:
            print(
                f"[WARNING] State not found: {state_name}"
            )
            continue

        state_id = state[0]

        cursor.execute(
            query,
            (
                seat_code,
                seat_name,
                seat_type,
                state_id
            )
        )

        count += 1

    print(f"[OK] Seats processed: {count}")


# ============================================================
# LOAD CANDIDATES
# ============================================================

def load_candidates(cursor, df):

    print("\n[5/6] Loading candidates...")

    candidates = (
        df[
            [
                "candidate_uid",
                "name",
                "party",
                "seat"
            ]
        ]
        .dropna(subset=["candidate_uid", "name", "seat"])
        .drop_duplicates()
    )

    query = """
        INSERT INTO candidates
        (
            candidate_uid,
            candidate_name,
            party_id,
            seat_id
        )
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (candidate_uid, seat_id) DO NOTHING
    """

    count = 0

    for _, row in candidates.iterrows():

        candidate_uid = clean_value(
            row["candidate_uid"]
        )

        candidate_name = clean_value(
            row["name"]
        )

        party_name = clean_value(
            row["party"]
        )

        seat_code, seat_name = split_seat(
            row["seat"]
        )

        # Find seat
        cursor.execute(
            """
            SELECT seat_id
            FROM seats
            WHERE seat_code = %s
            AND seat_name = %s
            """,
            (
                seat_code,
                seat_name
            )
        )

        seat = cursor.fetchone()

        if not seat:
            continue

        seat_id = seat[0]

        # Find party
        party_id = None

        if party_name:

            cursor.execute(
                """
                SELECT party_id
                FROM parties
                WHERE party_name = %s
                """,
                (party_name,)
            )

            party = cursor.fetchone()

            if party:
                party_id = party[0]

        cursor.execute(
            query,
            (
                candidate_uid,
                candidate_name,
                party_id,
                seat_id
            )
        )

        count += 1

    print(f"[OK] Candidates processed: {count}")


# ============================================================
# LOAD ELECTION RESULTS
# ============================================================

def load_results(cursor, df):

    print("\n[6/6] Loading election results...")

    query = """
        INSERT INTO election_results
        (
            election_id,
            seat_id,
            candidate_id,
            party_id,
            total_votes,
            vote_percentage,
            result_status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (election_id, candidate_id) DO NOTHING
    """

    count = 0
    skipped = 0

    for _, row in df.iterrows():

        election_name = clean_value(
            row["election"]
        )

        election_year = (
            int(row["election_year"])
            if not pd.isna(row["election_year"])
            else None
        )

        seat_code, seat_name = split_seat(
            row["seat"]
        )

        candidate_uid = clean_value(
            row["candidate_uid"]
        )

        # ----------------------------------------------------
        # Election
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT election_id
            FROM elections
            WHERE election_name = %s
            AND election_year = %s
            """,
            (
                election_name,
                election_year
            )
        )

        election = cursor.fetchone()

        if not election:
            skipped += 1
            continue

        election_id = election[0]

        # ----------------------------------------------------
        # Seat
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT seat_id
            FROM seats
            WHERE seat_code = %s
            AND seat_name = %s
            """,
            (
                seat_code,
                seat_name
            )
        )

        seat = cursor.fetchone()

        if not seat:
            skipped += 1
            continue

        seat_id = seat[0]

        # ----------------------------------------------------
        # Candidate
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT candidate_id, party_id
            FROM candidates
            WHERE candidate_uid = %s
            AND seat_id = %s
            """,
            (
                candidate_uid,
                seat_id
            )
        )

        candidate = cursor.fetchone()

        if not candidate:
            skipped += 1
            continue

        candidate_id = candidate[0]
        party_id = candidate[1]

        # ----------------------------------------------------
        # Votes
        # ----------------------------------------------------

        votes = 0

        if not pd.isna(row["votes"]):

            try:
                votes = int(row["votes"])

            except (ValueError, TypeError):
                votes = 0

        # ----------------------------------------------------
        # Vote percentage
        # ----------------------------------------------------

        vote_percentage = None

        if not pd.isna(row["votes_perc"]):

            try:
                vote_percentage = float(
                    row["votes_perc"]
                )

            except (ValueError, TypeError):
                vote_percentage = None

        # ----------------------------------------------------
        # Result
        # ----------------------------------------------------

        result_status = clean_value(
            row["result"]
        )

        cursor.execute(
            query,
            (
                election_id,
                seat_id,
                candidate_id,
                party_id,
                votes,
                vote_percentage,
                result_status
            )
        )

        count += 1

    print(
        f"[OK] Results processed: {count:,}"
    )

    print(
        f"[INFO] Results skipped: {skipped:,}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("Malaysia Election Intelligence System")
    print("PostgreSQL Data Loading Pipeline")
    print("=" * 60)

    print(f"\nDataset:")
    print(DATA_FILE)

    # --------------------------------------------------------
    # Check dataset
    # --------------------------------------------------------

    if not DATA_FILE.exists():

        raise FileNotFoundError(
            f"Dataset not found: {DATA_FILE}"
        )

    # --------------------------------------------------------
    # Load CSV
    # --------------------------------------------------------

    print("\nLoading cleaned dataset...")

    df = pd.read_csv(
        DATA_FILE,
        low_memory=False
    )

    print(
        f"[OK] Loaded {len(df):,} records"
    )

    # --------------------------------------------------------
    # Connect PostgreSQL
    # --------------------------------------------------------

    print("\nConnecting to PostgreSQL...")

    connection = get_connection()

    cursor = connection.cursor()

    print(
        "[OK] PostgreSQL connection established"
    )

    try:

        # ----------------------------------------------------
        # Load tables
        # ----------------------------------------------------

        load_states(
            cursor,
            df
        )

        load_parties(
            cursor,
            df
        )

        load_elections(
            cursor,
            df
        )

        load_seats(
            cursor,
            df
        )

        load_candidates(
            cursor,
            df
        )

        load_results(
            cursor,
            df
        )

        # ----------------------------------------------------
        # Commit
        # ----------------------------------------------------

        connection.commit()

        print("\n" + "=" * 60)
        print("DATABASE LOADING COMPLETED")
        print("=" * 60)

    except Exception as error:

        connection.rollback()

        print("\n" + "=" * 60)
        print("DATABASE LOADING FAILED")
        print("=" * 60)

        print(
            f"\nError: {error}"
        )

        raise

    finally:

        cursor.close()
        connection.close()

        print(
            "\nPostgreSQL connection closed."
        )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()