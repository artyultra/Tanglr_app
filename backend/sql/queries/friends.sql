-- name: CreateFriend :exec
INSERT INTO friends (user_id, friend_id, initiator_id)
values ($1, $2, $3)
returning *;

-- name: GetFriendRequests :many
SELECT * FROM friends WHERE status = 'pending';

-- name: GetFriendsList :many
SELECT 
    f.*,
    u.username as friend_username,
    u.avatar_url as friend_avatar_url
    -- Add any other user fields you need
FROM 
    friends f
JOIN 
    users u ON (
        CASE 
            WHEN f.user_id = $1 THEN f.friend_id
            ELSE f.user_id
        END = u.id
    )
WHERE 
    f.status = 'pending' AND (f.user_id = $1 OR f.friend_id = $1);

-- name: UpdateFriendStatus :exec
UPDATE friends SET status = $1 WHERE user_id = $2 AND friend_id = $3;

-- name: DeleteFriend :exec
DELETE FROM friends WHERE user_id = $1 AND friend_id = $2;

-- name: ResetFriendsTable :exec
DELETE FROM friends;
