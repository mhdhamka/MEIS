-- ============================================================
-- MEIS - GE15 Parliamentary Seats by State
-- ============================================================

SELECT
    st.state_name,
    COUNT(DISTINCT er.seat_id) AS seats_won

FROM election_results er

JOIN elections e
    ON er.election_id = e.election_id

JOIN seats s
    ON er.seat_id = s.seat_id

JOIN states st
    ON s.state_id = st.state_id

WHERE e.election_year = 2022
  AND s.seat_type = 'Parliament'
  AND er.result_status = 'won'

GROUP BY
    st.state_name

ORDER BY
    seats_won DESC;