from fastapi import APIRouter, HTTPException
from app.database.connection import get_connection
import psycopg2.extras


router = APIRouter(
    tags=["Parties"]
)


# ============================================================
# GET ALL PARTIES
# ============================================================

@router.get("/")
def get_parties():

    connection = None
    cursor = None

    try:
        connection = get_connection()
        # FIX: Use psycopg2 RealDictCursor for PostgreSQL compatibility
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT
                party_id,
                party_name
            FROM parties
            ORDER BY party_name ASC
        """

        cursor.execute(query)

        parties = cursor.fetchall()

        return {
            "count": len(parties),
            "data": parties
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve parties: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# GET SINGLE PARTY
# ============================================================

@router.get("/{party_id}")
def get_party(party_id: int):

    connection = None
    cursor = None

    try:
        connection = get_connection()
        # FIX: Use psycopg2 RealDictCursor for PostgreSQL compatibility
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT
                party_id,
                party_name
            FROM parties
            WHERE party_id = %s
        """

        cursor.execute(query, (party_id,))

        party = cursor.fetchone()

        if not party:

            raise HTTPException(
                status_code=404,
                detail=f"Party with ID {party_id} not found"
            )

        return {
            "data": party
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve party: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()