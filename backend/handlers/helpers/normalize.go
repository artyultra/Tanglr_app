package helpers

import (
	"bytes"

	"github.com/google/uuid"
)

func NormalizeUsername(userID, friendID uuid.UUID) (uuid.UUID, uuid.UUID) {

	if bytes.Compare(userID[:], friendID[:]) < 0 {
		return userID, friendID
	}
	return friendID, userID
}
