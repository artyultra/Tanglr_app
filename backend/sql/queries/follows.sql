-- name: InitiateFollowRequest :one
INSERT INTO follows (initiator_id, target_id, status)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetFollowerList :many
SELECT
    f.*,
    u.username as follower_username,
    up.avatar_url as follower_avatar_url
FROM
    follows f
JOIN
    users u ON f.initiator_id = u.id
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE
    f.status = 'accepted' AND f.target_id = $1;

-- name: GetFollowingList :many
SELECT
    f.*,
    u.username as following_username,
    up.avatar_url as following_avatar_url
FROM
    follows f
JOIN
    users u ON f.target_id = u.id
LEFT JOIN
    user_preferences up ON up.user_id = u.id
WHERE
    f.status = 'accepted' AND f.initiator_id = $1;

-- name: AcceptFollowRequest :exec
UPDATE follows
SET status = 'accepted', updated_at = NOW()
WHERE initiator_id = $1
    AND target_id = $2
    AND status = 'pending';

-- name: RejectFollowRequest :exec
DELETE FROM follows
WHERE initiator_id = $1
    AND target_id = $2
    AND status = 'pending';

-- name: UnfollowUser :exec
DELETE FROM follows
WHERE initiator_id = $1 
    AND target_id = $2
    AND status = 'accepted';

-- name: ResetFollowsTable :exec
DELETE FROM follows;
