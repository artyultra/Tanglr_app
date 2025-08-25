-- +goose Up
CREATE TABLE follows (
  initiator_id UUID NOT NULL,
  target_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (initiator_id != target_id),

  PRIMARY KEY (initiator_id, target_id),
  FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_follows_target_status ON follows(target_id, status);
CREATE INDEX idx_follows_initiator_status ON follows(initiator_id, status);

-- +goose Down
DROP TABLE follows;
