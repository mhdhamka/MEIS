-- ============================================================
-- MEIS - GE15 Seat Winners
-- ============================================================

SELECT
    e.election_name,
    e.election_year,

    s.seat_code,
    s.seat_name,
    s.seat_type,

    st.state_name,

    c.candidate_name,

    p.party_name,

    er.total_votes,
    er.vote_percentage

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

WHERE e.election_year = 2022
  AND s.seat_type = 'Parliament'
  AND er.result_status = 'won'

ORDER BY
    st.state_name,
    s.seat_code;