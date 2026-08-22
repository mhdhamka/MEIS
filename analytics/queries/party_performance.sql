-- ============================================================
-- Party Performance
-- ============================================================

SELECT
    e.election_name,
    e.election_year,
    p.party_name,
    COUNT(DISTINCT er.seat_id) AS seats_contested,
    SUM(er.total_votes) AS total_votes,
    COUNT(
        CASE
            WHEN UPPER(er.result_status) LIKE '%WIN%'
            THEN 1
        END
    ) AS seats_won
FROM election_results er
JOIN elections e
    ON er.election_id = e.election_id
LEFT JOIN parties p
    ON er.party_id = p.party_id
GROUP BY
    e.election_id,
    p.party_id,
    p.party_name
ORDER BY
    e.election_year DESC,
    seats_won DESC;