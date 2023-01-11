DROP TABLE IF EXISTS leaderboard;

CREATE TABLE  leaderboard (
    breed       varchar PRIMARY KEY NOT NULL,
    votes       integer default 0
);