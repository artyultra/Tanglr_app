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
    up.private_mode,
    up.created_at as preferences_created_at,
    up.updated_at as preferences_updated_at,
    (
      SELECT COUNT(*)
      FROM follows f
      WHERE f.initiator_id = u.id
      and f.status = 'accepted'
    ) as following_count,
    (
      SELECT COUNT(*)
      FROM follows f
      WHERE f.target_id = u.id
      and f.status = 'accepted'
    ) as follower_count
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
    up.private_mode,
    up.created_at as preferences_created_at,
    up.updated_at as preferences_updated_at,
    (
      SELECT COUNT(*)
      FROM follows f
      WHERE f.initiator_id = u.id
      and f.status = 'accepted'
    ) as following_count,
    (
      SELECT COUNT(*)
      FROM follows f
      WHERE f.target_id = u.id
      and f.status = 'accepted'
    ) as follower_count
FROM 
    users u
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE u.username = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: ResetUsersTable :exec
delete from users;

