-- +goose Up
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    avatar_url TEXT NOT NULL DEFAULT 'https://68rdbf2n6t.ufs.sh/f/eFaWLjkdXdtlUmFpmNXcWR3rVUzBTD2ukjxYylC9Gm7iqA4o',
    cover_url TEXT NOT NULL DEFAULT '#',
    dark_mode BOOLEAN NOT NULL DEFAULT true,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- +goose Down
DROP TABLE user_preferences;
