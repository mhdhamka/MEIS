from fastapi import APIRouter, Query, HTTPException
from app.database.connection import get_connection

router = APIRouter(
    tags=["Candidates"]
)


@router.get("/")
def get_candidates(
    seat_id: int | None = Query(default=None),
    party_id: int | None = Query(default=None),
    election_id: int | None = Query(default=None),
    state: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=5000),  
    offset: int = Query(default=0, ge=0)
):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Base filter conditions with LEFT JOIN to election_results
        base_where_clause = """
            FROM candidates c 
            LEFT JOIN parties p ON c.party_id = p.party_id 
            JOIN seats s ON c.seat_id = s.seat_id 
            JOIN states st ON s.state_id = st.state_id 
            LEFT JOIN election_results er ON c.candidate_id = er.candidate_id
            WHERE 1 = 1
        """
        params = []

        if seat_id is not None:
            base_where_clause += " AND c.seat_id = %s"
            params.append(seat_id)

        if party_id is not None:
            base_where_clause += " AND c.party_id = %s"
            params.append(party_id)

        if election_id is not None:
            base_where_clause += " AND er.election_id = %s"
            params.append(election_id)

        if state is not None and state != "all":
            base_where_clause += " AND st.state_name = %s"
            params.append(state)

        # 1. Fetch total count matching filters (vital for front-end pagination components)
        count_query = "SELECT COUNT(DISTINCT c.candidate_id) as total" + base_where_clause
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()["total"]

        # 2. Fetch paginated data records including result_status and votes
        data_query = """
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
                st.state_name,

                er.result_status,
                er.total_votes AS votes,
                er.vote_percentage AS vote_share,
                er.election_id
        """ + base_where_clause + """
            ORDER BY
                st.state_name,
                s.seat_code,
                c.candidate_name

            LIMIT %s OFFSET %s
        """
        
        # Extend parameters for LIMIT and OFFSET
        data_params = params + [limit, offset]
        cursor.execute(data_query, data_params)
        candidates = cursor.fetchall()

        return {
            "count": total_count,
            "limit": limit,
            "offset": offset,
            "data": candidates
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        cursor.close()
        connection.close()


@router.get("/{candidate_id}")
def get_candidate_by_id(candidate_id: str):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    try:
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
                st.state_name,
                er.result_status,
                er.total_votes AS votes,
                er.vote_percentage AS vote_share,
                er.election_id
            FROM candidates c 
            LEFT JOIN parties p ON c.party_id = p.party_id 
            JOIN seats s ON c.seat_id = s.seat_id 
            JOIN states st ON s.state_id = st.state_id 
            LEFT JOIN election_results er ON c.candidate_id = er.candidate_id
            WHERE c.candidate_id = %s OR c.candidate_uid = %s
            LIMIT 1
        """
        cursor.execute(query, (candidate_id, candidate_id))
        candidate = cursor.fetchone()
        
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
            
        return {"data": candidate}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        cursor.close()
        connection.close()