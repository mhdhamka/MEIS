from fastapi import APIRouter, Query
from app.database.connection import get_connection

router = APIRouter(
    prefix="/api/results",
    tags=["Results"]
)


@router.get("/")
def get_results(
    election_id: int | None = Query(default=None),
    seat_id: int | None = Query(default=None),
    party_id: int | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            er.result_id,

            e.election_id,
            e.election_name,
            e.election_year,
            e.election_type,

            s.seat_id,
            s.seat_code,
            s.seat_name,
            s.seat_type,

            st.state_id,
            st.state_name,

            c.candidate_id,
            c.candidate_name,

            p.party_id,
            p.party_name,

            er.total_votes,
            er.vote_percentage,
            er.result_status

        FROM election_results er

        JOIN elections e
            ON er.election_id = e.election_id

        JOIN seats s
            ON er.seat_id = s.seat_id

        JOIN states st
            ON s.state_id = st.state_id

        JOIN candidates c
            ON er.candidate_id = c.candidate_id

        LEFT JOIN parties p
            ON er.party_id = p.party_id

        WHERE 1 = 1
    """

    params = []

    if election_id is not None:
        query += " AND er.election_id = %s"
        params.append(election_id)

    if seat_id is not None:
        query += " AND er.seat_id = %s"
        params.append(seat_id)

    if party_id is not None:
        query += " AND er.party_id = %s"
        params.append(party_id)

    query += """
        ORDER BY
            e.election_year DESC,
            s.seat_code,
            er.total_votes DESC

        LIMIT %s OFFSET %s
    """

    params.extend([limit, offset])

    cursor.execute(query, params)
    results = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "count": len(results),
        "limit": limit,
        "offset": offset,
        "data": results
    }