-- name: CreateUserPreferences :exec
INSERT INTO user_preferences (id, user_id)
VALUES (gen_random_uuid(), $1);

-- name: PutAvatarUrl :exec
UPDATE user_preferences
SET avatar_url = $1,
    updated_at = now()
WHERE user_id = $2;

-- name: ResetUserPreferencesTable :exec
DELETE FROM user_preferences;
