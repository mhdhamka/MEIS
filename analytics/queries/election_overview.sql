-- ============================================================
-- MEIS - Election Overview
-- ============================================================

SELECT
    election_id,
    election_name,
    election_year,
    election_type
FROM elections
ORDER BY election_year DESC;