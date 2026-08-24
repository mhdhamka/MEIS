from fastapi import APIRouter, Query
from app.database.connection import get_connection

router = APIRouter(
    tags=["Seats"]
)


@router.get("/")
def get_seats(
    seat_type: str | None = Query(default=None),
    state_id: int | None = Query(default=None)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            s.seat_id,
            s.seat_code,
            s.seat_name,
            s.seat_type,
            st.state_id,
            st.state_name
        FROM seats s
        JOIN states st
            ON s.state_id = st.state_id
        WHERE 1 = 1
    """

    params = []

    if seat_type:
        query += " AND s.seat_type = %s"
        params.append(seat_type)

    if state_id:
        query += " AND s.state_id = %s"
        params.append(state_id)

    query += """
        ORDER BY
            st.state_name,
            s.seat_code
    """

    cursor.execute(query, params)
    seats = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "count": len(seats),
        "data": seats
    }