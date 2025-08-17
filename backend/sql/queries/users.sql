-- name: CreateUser :one
INSERT INTO users (id, username, email, hashed_password, created_at, updated_at, avatar_url)
VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: ChangeAvatarForuser :exec
UPDATE users SET avatar_url = $1 WHERE id = $2;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: ResetUsersTable :exec
delete from users;

-- name: GetNonFriendUsers :many
SELECT * FROM users u 
WHERE u.id != $1 
AND NOT EXISTS (
    SELECT 1 FROM friends f 
    WHERE (f.user_id = $1 AND f.friend_id = u.id)
    OR (f.friend_id = $1 AND f.user_id = u.id)
);
