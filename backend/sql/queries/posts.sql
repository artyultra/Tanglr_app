-- name: CreatePost :exec
INSERT INTO posts (id, body, created_at, updated_at, user_id)
VALUES (gen_random_uuid(), $1, $2, $3, $4);

-- name: GetPosts :many
SELECT 
    posts.*,
    u.username AS username,
    up.avatar_url AS avatar_url
FROM posts
JOIN users u ON posts.user_id = u.id
LEFT JOIN user_preferences up ON up.user_id = u.id
ORDER BY posts.created_at DESC;

-- name: GetPostsByUsername :many
SELECT 
    posts.*,
    u.username,
    up.avatar_url as user_avatar_url
FROM posts 
JOIN users u ON posts.user_id = u.id
LEFT JOIN user_preferences up ON up.user_id = u.id
WHERE u.username = $1
ORDER BY posts.created_at DESC;

-- name: ResetPostsTable :exec
DELETE FROM posts;

