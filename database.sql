CREATE DATABASE perntodo;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    chat_notice_id INT [],
    friends_id INT [],
);

CREATE TABLE chat_room(
    id SERIAL PRIMARY KEY,
    users_id INT [] NOT NULL check (
        users_id <> '{}'
        and array_position(users_id, null) is null
    ),
    last_message INT,
    chat_name VARCHAR(255),
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE message_list(
    id SERIAL PRIMARY KEY,
    sender INT NOT NULL,
    reader INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    tag VARCHAR(255) NOT NULL,
    chat_room_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Add new columns to table
ALTER TABLE
    users
ADD
    COLUMN column_name1 data_type constraint,
ADD
    COLUMN column_name2 data_type constraint,
    -- Change column data type
ALTER TABLE
    chat_room
ALTER COLUMN
    last_message TYPE INTEGER USING array [last_message] :: INTEGER;