-- name: CreatePost :one
INSERT INTO posts (id, body, created_at, updated_at, user_id, username)
VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
RETURNING *;

-- name: GetPosts :many
SELECT * FROM posts; 

-- name: GetPostsByUsername :many
SELECT posts.*,  users.avatar_url as user_avatar_url
FROM posts 
JOIN users ON posts.user_id = users.id
WHERE users.username = $1;

-- name: ResetPostsTable :exec
DELETE FROM posts;

