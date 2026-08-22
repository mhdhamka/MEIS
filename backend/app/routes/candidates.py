from fastapi import APIRouter, Query
from app.database.connection import get_connection

router = APIRouter(
    prefix="/api/candidates",
    tags=["Candidates"]
)


@router.get("/")
def get_candidates(
    seat_id: int | None = Query(default=None),
    party_id: int | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            c.candidate_id,
            c.candidate_uid,
            c.candidate_name,

            p.party_id,
            p.party_name,

            s.seat_id,
            s.seat_code,
            s.seat_name,
            s.seat_type,

            st.state_id,
            st.state_name

        FROM candidates c

        LEFT JOIN parties p
            ON c.party_id = p.party_id

        JOIN seats s
            ON c.seat_id = s.seat_id

        JOIN states st
            ON s.state_id = st.state_id

        WHERE 1 = 1
    """

    params = []

    if seat_id is not None:
        query += " AND c.seat_id = %s"
        params.append(seat_id)

    if party_id is not None:
        query += " AND c.party_id = %s"
        params.append(party_id)

    query += """
        ORDER BY
            st.state_name,
            s.seat_code,
            c.candidate_name

        LIMIT %s OFFSET %s
    """

    params.extend([limit, offset])

    cursor.execute(query, params)
    candidates = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "count": len(candidates),
        "limit": limit,
        "offset": offset,
        "data": candidates
    }