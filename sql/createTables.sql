DROP TABLE IF EXISTS leaderboard;

CREATE TABLE  leaderboard (
    name          varchar PRIMARY KEY,
    votes       integer default 0
);