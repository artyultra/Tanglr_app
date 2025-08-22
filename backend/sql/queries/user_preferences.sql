-- name: CreateUserPreferences :exec
INSERT INTO user_preferences (id, user_id)
VALUES (gen_random_uuid(), $1);
