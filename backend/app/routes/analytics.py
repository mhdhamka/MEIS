from fastapi import APIRouter, HTTPException
from app.database.connection import get_connection

router = APIRouter(
    tags=["Analytics"]
)


# ============================================================
# OVERVIEW
# ============================================================

@router.get("/overview")
def get_overview():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                (SELECT COUNT(*) FROM states) AS total_states,
                (SELECT COUNT(*) FROM parties) AS total_parties,
                (SELECT COUNT(*) FROM seats) AS total_seats,
                (SELECT COUNT(*) FROM candidates) AS total_candidates,
                (SELECT COUNT(*) FROM elections) AS total_elections,
                (SELECT COALESCE(SUM(total_votes), 0)
                 FROM election_results) AS total_votes
        """)

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


# ============================================================
# PARTY PERFORMANCE
# ============================================================

@router.get("/party-performance")
def get_party_performance(
    election_id: int | None = None,
    seat_type: str | None = None
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT
                p.party_id,
                p.party_name,
                COUNT(DISTINCT er.seat_id) AS seats_contested,
                SUM(er.total_votes) AS total_votes,
                ROUND(
                    SUM(er.total_votes) * 100.0 /
                    NULLIF(
                        (
                            SELECT SUM(er2.total_votes)
                            FROM election_results er2
                            WHERE
                                (%s IS NULL OR er2.election_id = %s)
                        ),
                        0
                    ),
                    2
                ) AS vote_share
            FROM election_results er
            JOIN parties p
                ON er.party_id = p.party_id
            JOIN seats s
                ON er.seat_id = s.seat_id
            WHERE
                (%s IS NULL OR er.election_id = %s)
                AND
                (%s IS NULL OR s.seat_type = %s)
            GROUP BY
                p.party_id,
                p.party_name
            ORDER BY total_votes DESC
        """

        params = (
            election_id,
            election_id,
            election_id,
            election_id,
            seat_type,
            seat_type
        )

        cursor.execute(query, params)

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


# ============================================================
# SEAT COUNTS
# ============================================================

@router.get("/seat-counts")
def get_seat_counts(
    election_id: int | None = None,
    seat_type: str | None = None
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT
                p.party_name,
                COUNT(*) AS seats_won
            FROM election_results er
            JOIN parties p
                ON er.party_id = p.party_id
            JOIN seats s
                ON er.seat_id = s.seat_id
            WHERE
                er.result_status = 'WINNER'
                AND (%s IS NULL OR er.election_id = %s)
                AND (%s IS NULL OR s.seat_type = %s)
            GROUP BY p.party_id, p.party_name
            ORDER BY seats_won DESC
        """

        cursor.execute(
            query,
            (
                election_id,
                election_id,
                seat_type,
                seat_type
            )
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


# ============================================================
# STATE PERFORMANCE
# ============================================================

@router.get("/state-performance")
def get_state_performance(
    election_id: int | None = None
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT
                st.state_name,
                COUNT(DISTINCT s.seat_id) AS total_seats,
                COUNT(
                    DISTINCT CASE
                        WHEN er.result_status = 'WINNER'
                        THEN er.seat_id
                    END
                ) AS seats_with_results,
                SUM(er.total_votes) AS total_votes
            FROM states st
            JOIN seats s
                ON st.state_id = s.state_id
            JOIN election_results er
                ON s.seat_id = er.seat_id
            WHERE
                (%s IS NULL OR er.election_id = %s)
            GROUP BY
                st.state_id,
                st.state_name
            ORDER BY total_votes DESC
        """

        cursor.execute(
            query,
            (
                election_id,
                election_id
            )
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


# ============================================================
# WINNING MARGINS
# ============================================================

@router.get("/winning-margins")
def get_winning_margins(
    election_id: int | None = None,
    seat_type: str | None = None
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT
                s.seat_code,
                s.seat_name,
                s.seat_type,
                p.party_name,
                c.candidate_name,
                er.total_votes AS winner_votes,
                (
                    er.total_votes -
                    COALESCE(
                        (
                            SELECT MAX(er2.total_votes)
                            FROM election_results er2
                            WHERE
                                er2.election_id = er.election_id
                                AND er2.seat_id = er.seat_id
                                AND er2.candidate_id <> er.candidate_id
                        ),
                        0
                    )
                ) AS winning_margin
            FROM election_results er
            JOIN seats s
                ON er.seat_id = s.seat_id
            JOIN candidates c
                ON er.candidate_id = c.candidate_id
            LEFT JOIN parties p
                ON er.party_id = p.party_id
            WHERE
                er.result_status = 'WINNER'
                AND (%s IS NULL OR er.election_id = %s)
                AND (%s IS NULL OR s.seat_type = %s)
            ORDER BY winning_margin DESC
        """

        cursor.execute(
            query,
            (
                election_id,
                election_id,
                seat_type,
                seat_type
            )
        )

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


# ============================================================
# ELECTION COMPARISON
# ============================================================

@router.get("/election-comparison")
def election_comparison(
    seat_id: int | None = None
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT
                e.election_id,
                e.election_name,
                e.election_year,
                c.candidate_name,
                p.party_name,
                er.total_votes,
                er.vote_percentage,
                er.result_status
            FROM election_results er
            JOIN elections e
                ON er.election_id = e.election_id
            JOIN candidates c
                ON er.candidate_id = c.candidate_id
            LEFT JOIN parties p
                ON er.party_id = p.party_id
            WHERE (%s IS NULL OR er.seat_id = %s)
            ORDER BY e.election_year DESC, er.total_votes DESC
        """

        cursor.execute(query, (seat_id, seat_id))

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()