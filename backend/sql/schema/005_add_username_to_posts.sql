-- +goose Up
ALTER TABLE posts ADD COLUMN username TEXT NOT NULL DEFAULT '';

-- +goose Down
ALTER TABLE posts DROP COLUMN username;
