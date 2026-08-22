from fastapi import APIRouter, HTTPException

from app.database.connection import get_connection


router = APIRouter(
    prefix="/api/states",
    tags=["States"]
)


# ============================================================
# GET ALL STATES
# ============================================================

@router.get("/")
def get_states():

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                state_id,
                state_name
            FROM states
            ORDER BY state_name ASC
        """

        cursor.execute(query)

        states = cursor.fetchall()

        return {
            "count": len(states),
            "data": states
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve states: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# GET SINGLE STATE
# ============================================================

@router.get("/{state_id}")
def get_state(state_id: int):

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                state_id,
                state_name
            FROM states
            WHERE state_id = %s
        """

        cursor.execute(query, (state_id,))

        state = cursor.fetchone()

        if not state:

            raise HTTPException(
                status_code=404,
                detail=f"State with ID {state_id} not found"
            )

        return {
            "data": state
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve state: {error}"
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()