package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/artyultra/tanglr/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

type Friends struct {
	UserID      uuid.UUID `json:"user_id"`
	FriendID    uuid.UUID `json:"friend_id"`
	Status      string    `json:"status"`
	InitiatorID uuid.UUID `json:"initiator_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type FriendUser struct {
	UserID          uuid.UUID `json:"user_id"`
	FriendID        uuid.UUID `json:"friend_id"`
	Status          string    `json:"status"`
	InitiatorID     uuid.UUID `json:"initiator_id"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	FriendUsername  string    `json:"friend_username"`
	FriendAvatarURL string    `json:"friend_avatar_url"`
}

func helperFriends(cfg *Config, w http.ResponseWriter, r *http.Request) database.User {
	username := chi.URLParam(r, "username")
	if username == "" {
		helpers.RespondWithError(w, http.StatusBadRequest, "Missing username", nil)
		return database.User{}
	}

	jwtToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return database.User{}
	}

	_, err = auth.ValidateJWT(jwtToken, cfg.jwtSecret)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return database.User{}
	}

	DBUser, err := cfg.DB.GetUserByUsername(r.Context(), username)

	return DBUser
}

func (cfg *Config) HandlerGetNonFriends(w http.ResponseWriter, r *http.Request) {
	dbUser := helperFriends(cfg, w, r)

	dbNonFriends, err := cfg.DB.GetNonFriendUsers(r.Context(), dbUser.ID)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	nonFriends := []User{}
	for _, user := range dbNonFriends {
		nonFriends = append(nonFriends, User{
			Username:  user.Username,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			AvatarURL: user.AvatarUrl,
		})
	}

	helpers.RespondWithJSON(w, http.StatusOK, nonFriends)
}

func (cfg *Config) HandlerGetFriends(w http.ResponseWriter, r *http.Request) {
	dbUser := helperFriends(cfg, w, r)

	dbFriends, err := cfg.DB.GetFriendsList(r.Context(), dbUser.ID)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Internal Server Error", err)
		return
	}

	log.Println(dbFriends)

	friends := []FriendUser{}
	for _, friend := range dbFriends {
		userID := dbUser.ID
		friendID := friend.UserID
		if friend.UserID == dbUser.ID {
			userID = friend.FriendID
			friendID = friend.UserID
		}
		friends = append(friends, FriendUser{
			UserID:          userID,
			FriendID:        friendID,
			Status:          friend.Status,
			InitiatorID:     friend.InitiatorID,
			CreatedAt:       friend.CreatedAt,
			UpdatedAt:       friend.UpdatedAt,
			FriendUsername:  friend.FriendUsername,
			FriendAvatarURL: friend.FriendAvatarUrl,
		})
	}

	helpers.RespondWithJSON(w, http.StatusOK, friends)

}
