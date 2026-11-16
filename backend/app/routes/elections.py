from fastapi import APIRouter, HTTPException
from app.database.connection import get_connection
import psycopg2.extras


router = APIRouter(
    tags=["Elections"]
)


# ============================================================
# GET ALL ELECTIONS
# ============================================================

@router.get("/")
def get_elections():

    connection = None
    cursor = None

    try:
        connection = get_connection()
        # FIX: Use psycopg2 RealDictCursor for PostgreSQL compatibility
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT
                election_id,
                election_name,
                election_year,
                election_type
            FROM elections
            ORDER BY election_year DESC, election_id DESC
        """

        cursor.execute(query)

        elections = cursor.fetchall()

        return {
            "count": len(elections),
            "data": elections
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve elections: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# GET SINGLE ELECTION
# ============================================================

@router.get("/{election_id}")
def get_election(election_id: int):

    connection = None
    cursor = None

    try:
        connection = get_connection()
        # FIX: Use psycopg2 RealDictCursor for PostgreSQL compatibility
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT
                election_id,
                election_name,
                election_year,
                election_type
            FROM elections
            WHERE election_id = %s
        """

        cursor.execute(query, (election_id,))

        election = cursor.fetchone()

        if not election:

            raise HTTPException(
                status_code=404,
                detail=f"Election with ID {election_id} not found"
            )

        return {
            "data": election
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve election: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()