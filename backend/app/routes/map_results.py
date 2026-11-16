from fastapi import APIRouter, HTTPException, Query
from app.database.connection import get_connection
import psycopg2.extras

router = APIRouter(
    tags=["Map"]
)


# ============================================================
# GET /api/v1/map/results
# ============================================================

@router.get("/results")
def get_map_results(
    election_id: int | None = Query(default=None),
    seat_type: str | None = Query(default=None),
    state: str | None = Query(default=None),
):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        # FIX: Use psycopg2 RealDictCursor for PostgreSQL compatibility
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # --------------------------------------------------
        # RESOLVE ELECTION_ID (default: most recent election)
        # --------------------------------------------------
        resolved_election_id = election_id

        if resolved_election_id is None:
            cursor.execute(
                """
                SELECT election_id
                FROM elections
                ORDER BY election_year DESC, election_id DESC
                LIMIT 1
                """
            )
            latest = cursor.fetchone()

            if not latest:
                raise HTTPException(
                    status_code=404,
                    detail="No elections found in the database",
                )

            resolved_election_id = latest["election_id"]

        # --------------------------------------------------
        # PER-SEAT WINNER + METRICS
        # --------------------------------------------------
        query = """
            SELECT
                s.seat_code,
                s.seat_name,
                s.seat_type,
                st.state_name,

                c.candidate_name AS winner_name,
                p.party_name,

                er.total_votes AS votes,
                er.vote_percentage AS vote_share,

                (
                    er.total_votes - COALESCE(
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
                ) AS margin,

                (
                    SELECT COUNT(DISTINCT er3.candidate_id)
                    FROM election_results er3
                    WHERE
                        er3.election_id = er.election_id
                        AND er3.seat_id = er.seat_id
                ) AS candidate_count,

                (
                    SELECT SUM(er4.total_votes)
                    FROM election_results er4
                    WHERE
                        er4.election_id = er.election_id
                        AND er4.seat_id = er.seat_id
                ) AS total_votes

            FROM election_results er

            JOIN seats s
                ON er.seat_id = s.seat_id

            JOIN states st
                ON s.state_id = st.state_id

            JOIN candidates c
                ON er.candidate_id = c.candidate_id

            LEFT JOIN parties p
                ON er.party_id = p.party_id

            WHERE
                er.result_status IN ('won', 'won_uncontested', 'WINNER')
                AND er.election_id = %s
                AND (%s::text IS NULL OR s.seat_type = %s)
                AND (%s::text IS NULL OR st.state_name = %s)

            ORDER BY s.seat_code
        """

        params = (
            resolved_election_id,
            seat_type,
            seat_type,
            state,
            state,
        )

        cursor.execute(query, params)
        rows = cursor.fetchall()

        for row in rows:
            row["turnout"] = None

        return {
            "election_id": resolved_election_id,
            "seat_type": seat_type,
            "state": state,
            "count": len(rows),
            "results": rows,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve map results: {error}",
        )

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()