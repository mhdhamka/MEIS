-- ============================================================
-- Election Summary
-- ============================================================

SELECT
    e.election_name,
    e.election_year,
    e.election_type,
    COUNT(DISTINCT er.seat_id) AS seats_contested,
    COUNT(DISTINCT er.candidate_id) AS candidates,
    SUM(er.total_votes) AS total_votes
FROM election_results er
JOIN elections e
    ON er.election_id = e.election_id
GROUP BY
    e.election_id,
    e.election_name,
    e.election_year,
    e.election_type
ORDER BY
    e.election_year DESC;