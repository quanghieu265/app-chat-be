CREATE DATABASE perntodo;

CREATE TABLE todo(
    id SERIAL PRIMARY KEY,
    descriptions VARCHAR(255)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL
);

CREATE TABLE chat_room(
    id SERIAL PRIMARY KEY,
    users INT [] NOT NULL check (
        users <> '{}'
        and array_position(users, null) is null
    ),
    last_message INT
);

CREATE TABLE message_list(
    id SERIAL PRIMARY KEY,
    sender INT NOT NULL,
    reader INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    chat_room INT NOT NULL
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