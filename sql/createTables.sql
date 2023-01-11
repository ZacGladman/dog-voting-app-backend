DROP TABLE IF EXISTS leaderboard;

CREATE TABLE  leaderboard (
    breed       varchar PRIMARY KEY,
    votes       integer default 0
);