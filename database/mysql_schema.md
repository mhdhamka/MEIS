CREATE DATABASE IF NOT EXISTS malaysia_election_intelligence;

USE malaysia_election_intelligence;

-- ============================================================
-- STATES
-- ============================================================

CREATE TABLE states (
    state_id INT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================================
-- PARTIES
-- ============================================================

CREATE TABLE parties (
    party_id INT AUTO_INCREMENT PRIMARY KEY,
    party_name VARCHAR(150) NOT NULL UNIQUE
);


-- ============================================================
-- ELECTIONS
-- ============================================================

CREATE TABLE elections (
    election_id INT AUTO_INCREMENT PRIMARY KEY,
    election_name VARCHAR(100) NOT NULL,
    election_year INT NOT NULL,
    election_type VARCHAR(50) NOT NULL,

    UNIQUE (
        election_name,
        election_year
    )
);


-- ============================================================
-- SEATS
-- ============================================================

CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,

    seat_code VARCHAR(20) NOT NULL,
    seat_name VARCHAR(150) NOT NULL,

    seat_type ENUM(
        'Parliament',
        'State Assembly'
    ) NOT NULL,

    state_id INT NOT NULL,

    UNIQUE (
        seat_code,
        seat_name
    ),

    FOREIGN KEY (state_id)
        REFERENCES states(state_id)
        ON DELETE CASCADE
);


-- ============================================================
-- CANDIDATES
-- ============================================================

CREATE TABLE candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,

    candidate_uid VARCHAR(100),
    candidate_name VARCHAR(255) NOT NULL,

    party_id INT,
    seat_id INT NOT NULL,

    FOREIGN KEY (party_id)
        REFERENCES parties(party_id)
        ON DELETE SET NULL,

    FOREIGN KEY (seat_id)
        REFERENCES seats(seat_id)
        ON DELETE CASCADE,

    UNIQUE (
        candidate_uid,
        seat_id
    )
);


-- ============================================================
-- ELECTION RESULTS
-- ============================================================

CREATE TABLE election_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,

    election_id INT NOT NULL,
    seat_id INT NOT NULL,
    candidate_id INT NOT NULL,
    party_id INT,

    total_votes INT NOT NULL DEFAULT 0,
    vote_percentage DECIMAL(8,4),

    result_status VARCHAR(50),

    FOREIGN KEY (election_id)
        REFERENCES elections(election_id)
        ON DELETE CASCADE,

    FOREIGN KEY (seat_id)
        REFERENCES seats(seat_id)
        ON DELETE CASCADE,

    FOREIGN KEY (candidate_id)
        REFERENCES candidates(candidate_id)
        ON DELETE CASCADE,

    FOREIGN KEY (party_id)
        REFERENCES parties(party_id)
        ON DELETE SET NULL,

    UNIQUE (
        election_id,
        candidate_id
    )
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_seats_state
ON seats(state_id);

CREATE INDEX idx_seats_type
ON seats(seat_type);

CREATE INDEX idx_elections_year
ON elections(election_year);

CREATE INDEX idx_results_election
ON election_results(election_id);

CREATE INDEX idx_results_seat
ON election_results(seat_id);

CREATE INDEX idx_results_party
ON election_results(party_id);