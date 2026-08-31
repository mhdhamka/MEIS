from fastapi import APIRouter, HTTPException, Query
from app.database.connection import get_connection

router = APIRouter(
    tags=["Map"]
)


# ============================================================
# GET /api/v1/map/results
#
# Purpose-built for the map page (plan step 21/30):
#
#   - Returns ONE row per seat: the winner + seat-level metrics.
#   - Never returns geometry — the frontend already has the
#     GeoJSON cached (useGeoSpatialData) and merges this analytics
#     payload into it by seat_code. That's what makes "geometry
#     does not refetch, analytics does refetch" possible: this
#     endpoint is cheap and small, so it's safe to call every
#     time `election_id` changes without touching the map's
#     GeoJSON cache at all.
#
# If election_id is omitted, the most recent election is used.
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
        cursor = connection.cursor(dictionary=True)

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
                er.result_status = 'WINNER'
                AND er.election_id = %s
                AND (%s IS NULL OR s.seat_type = %s)
                AND (%s IS NULL OR st.state_name = %s)

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

        # --------------------------------------------------
        # TURNOUT — NOT YET COMPUTABLE
        #
        # Turnout needs a registered-voters figure per seat, which
        # doesn't exist in this schema (seats/states have no
        # electorate column). Wiring it in later just means adding
        # that column and a `turnout = votes_cast / registered * 100`
        # line here — the frontend already treats `turnout: null`
        # as "N/A" (see ConstituencyInspector.jsx), so nothing else
        # needs to change when this is added.
        # --------------------------------------------------
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
