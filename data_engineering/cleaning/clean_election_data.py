from pathlib import Path
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET_DIR = BASE_DIR / "data" / "datasets"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

BALLOTS_FILE = DATASET_DIR / "consol_ballots.csv"
STATS_FILE = DATASET_DIR / "consol_stats.csv"

OUTPUT_FILE = PROCESSED_DIR / "election_results_clean.csv"


# ============================================================
# CREATE DIRECTORIES
# ============================================================

PROCESSED_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# LOAD DATA
# ============================================================

def load_ballots():

    print("Loading ballot dataset...")

    if not BALLOTS_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {BALLOTS_FILE}"
        )

    df = pd.read_csv(
        BALLOTS_FILE,
        low_memory=False
    )

    print(
        f"[OK] Loaded {len(df):,} ballot records"
    )

    return df


# ============================================================
# CLEAN COLUMN NAMES
# ============================================================

def clean_column_names(df):

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    return df


# ============================================================
# CLEAN TEXT VALUES
# ============================================================

def clean_text_columns(df):

    text_columns = [
        "election",
        "state",
        "seat",
        "candidate_uid",
        "name_on_ballot",
        "name",
        "sex",
        "ethnicity",
        "party_on_ballot",
        "party_uid",
        "party",
        "coalition_uid",
        "coalition",
        "result"
    ]

    for column in text_columns:

        if column in df.columns:

            df[column] = (
                df[column]
                .astype("string")
                .str.strip()
            )

    return df


# ============================================================
# CLEAN DATE
# ============================================================

def clean_dates(df):

    if "date" in df.columns:

        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

    return df


# ============================================================
# CLEAN NUMERIC VALUES
# ============================================================

def clean_numeric_values(df):

    numeric_columns = [
        "ballot_order",
        "age",
        "votes",
        "votes_perc",
        "rank"
    ]

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    return df


# ============================================================
# REMOVE DUPLICATES
# ============================================================

def remove_duplicates(df):

    before = len(df)

    df = df.drop_duplicates()

    after = len(df)

    removed = before - after

    print(
        f"[OK] Removed {removed:,} duplicate records"
    )

    return df


# ============================================================
# HANDLE MISSING VALUES
# ============================================================

def inspect_missing_values(df):

    print("\nMissing values:")

    missing = df.isna().sum()

    missing = missing[
        missing > 0
    ].sort_values(
        ascending=False
    )

    if missing.empty:

        print("No missing values found.")

    else:

        print(missing)


# ============================================================
# VALIDATE DATA
# ============================================================

def validate_data(df):

    print("\nValidating dataset...")

    required_columns = [
        "date",
        "election",
        "state",
        "seat",
        "candidate_uid",
        "name",
        "votes",
        "votes_perc",
        "result"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        raise ValueError(
            f"Missing required columns: "
            f"{missing_columns}"
        )

    print(
        "[OK] Required columns verified"
    )

    invalid_votes = (
        df["votes"].dropna() < 0
    ).sum()

    if invalid_votes:

        print(
            f"[WARNING] "
            f"{invalid_votes:,} records contain "
            f"negative votes"
        )

    invalid_percentage = (
        (df["votes_perc"].dropna() < 0)
        |
        (df["votes_perc"].dropna() > 100)
    ).sum()

    if invalid_percentage:

        print(
            f"[WARNING] "
            f"{invalid_percentage:,} records contain "
            f"invalid vote percentages"
        )

    print("[OK] Validation completed")


# ============================================================
# ADD DERIVED COLUMNS
# ============================================================

def add_derived_columns(df):

    # Determine seat type
    if "seat" in df.columns:

        df["seat_type"] = "Unknown"

        df.loc[
            df["seat"]
            .astype(str)
            .str.startswith("P."),
            "seat_type"
        ] = "Parliament"

        df.loc[
            df["seat"]
            .astype(str)
            .str.startswith("N."),
            "seat_type"
        ] = "State Assembly"

    # Extract election year
    if "date" in df.columns:

        df["election_year"] = (
            df["date"]
            .dt.year
        )

    return df


# ============================================================
# SAVE PROCESSED DATA
# ============================================================

def save_processed_data(df):

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print(
        f"\n[OK] Processed dataset saved:"
    )

    print(
        OUTPUT_FILE
    )


# ============================================================
# MAIN CLEANING PIPELINE
# ============================================================

def main():

    print("=" * 60)
    print("Malaysia Election Intelligence System")
    print("Election Data Cleaning Pipeline")
    print("=" * 60)

    # Load
    df = load_ballots()

    print(
        f"\nOriginal columns:"
    )

    print(
        list(df.columns)
    )

    # Cleaning
    print("\nCleaning column names...")
    df = clean_column_names(df)

    print("Cleaning text values...")
    df = clean_text_columns(df)

    print("Cleaning dates...")
    df = clean_dates(df)

    print("Cleaning numeric values...")
    df = clean_numeric_values(df)

    # Duplicates
    print("\nChecking duplicates...")
    df = remove_duplicates(df)

    # Missing values
    inspect_missing_values(df)

    # Validation
    validate_data(df)

    # Derived fields
    print("\nCreating derived fields...")
    df = add_derived_columns(df)

    # Save
    save_processed_data(df)

    # Summary
    print("\n" + "=" * 60)
    print("DATA CLEANING COMPLETED")
    print("=" * 60)

    print(
        f"\nFinal records: {len(df):,}"
    )

    print(
        f"Final columns: {len(df.columns)}"
    )

    print("\nSeat types:")

    if "seat_type" in df.columns:

        print(
            df["seat_type"]
            .value_counts()
        )

    print("\nElection years:")

    if "election_year" in df.columns:

        print(
            df["election_year"]
            .value_counts()
            .sort_index()
        )


if __name__ == "__main__":
    main()