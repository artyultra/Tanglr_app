-- name: CreateUser :one
INSERT INTO users (id, username, email, hashed_password, created_at, updated_at)
VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserById :one
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.hashed_password,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    up.id as preferences_id,
    up.avatar_url,
    up.cover_url,
    up.dark_mode,
    up.created_at as preferences_created_at,
    up.updated_at as preferences_updated_at
FROM 
    users u
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE u.id = $1;

-- name: GetUserByUsername :one
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.hashed_password,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    up.id as preferences_id,
    up.avatar_url,
    up.cover_url,
    up.dark_mode,
    up.created_at as preferences_created_at,
    up.updated_at as preferences_updated_at
FROM 
    users u
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE u.username = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: ChangeAvatarForuser :exec
UPDATE user_preferences SET avatar_url = $1 WHERE user_id = $2;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: ResetUsersTable :exec
delete from users;

-- name: GetNonFriendUsers :many
SELECT
    u.id as user_id,
    u.username,
    u.email,
    u.hashed_password,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    up.avatar_url
FROM
    users u
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE u.id != $1
AND NOT EXISTS (
    SELECT 1 FROM friends f 
    WHERE (f.user_id = $1 AND f.friend_id = u.id)
    OR (f.friend_id = $1 AND f.user_id = u.id)
);
