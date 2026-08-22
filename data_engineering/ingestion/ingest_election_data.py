from pathlib import Path
import shutil
import requests


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

RAW_DIR = BASE_DIR / "data" / "raw"
DATASET_DIR = BASE_DIR / "data" / "datasets"


DATA_SOURCES = {
    "consol_ballots.csv": (
        "https://raw.githubusercontent.com/"
        "Thevesh/paper-meco-results/main/data/consol_ballots.csv"
    ),

    "consol_stats.csv": (
        "https://raw.githubusercontent.com/"
        "Thevesh/paper-meco-results/main/data/consol_stats.csv"
    ),
}


# ============================================================
# CREATE DIRECTORIES
# ============================================================

def create_directories():

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    DATASET_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Raw directory: {RAW_DIR}")
    print(f"Dataset directory: {DATASET_DIR}")


# ============================================================
# DOWNLOAD DATA
# ============================================================

def download_file(url, filename):

    destination = RAW_DIR / filename

    print(f"Downloading {filename}...")

    response = requests.get(
        url,
        timeout=60
    )

    response.raise_for_status()

    with open(destination, "wb") as file:
        file.write(response.content)

    print(f"[OK] Saved: {destination}")

    return destination


# ============================================================
# COPY DATA INTO DATASET DIRECTORY
# ============================================================

def copy_to_dataset(filename):

    source = RAW_DIR / filename
    destination = DATASET_DIR / filename

    if not source.exists():

        print(
            f"[WARNING] Source file does not exist: {filename}"
        )

        return False

    shutil.copy2(
        source,
        destination
    )

    print(
        f"[OK] Dataset created: {destination}"
    )

    return True


# ============================================================
# INGESTION
# ============================================================

def ingest_data():

    print("\nDownloading source datasets...\n")

    for filename, url in DATA_SOURCES.items():

        try:

            download_file(
                url,
                filename
            )

        except requests.RequestException as error:

            print(
                f"[ERROR] Failed to download {filename}"
            )

            print(error)

            return False

    print("\nCopying datasets...\n")

    success = True

    for filename in DATA_SOURCES:

        if not copy_to_dataset(filename):

            success = False

    return success


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("Malaysia Election Intelligence System")
    print("Election Data Ingestion Pipeline")
    print("=" * 60)

    create_directories()

    success = ingest_data()

    print()

    if success:

        print("=" * 60)
        print("DATA INGESTION COMPLETED")
        print("=" * 60)

        print("\nRaw data:")
        print(RAW_DIR)

        print("\nDataset data:")
        print(DATASET_DIR)

    else:

        print("=" * 60)
        print("DATA INGESTION FAILED")
        print("=" * 60)


if __name__ == "__main__":
    main()