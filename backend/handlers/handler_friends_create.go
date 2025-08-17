package handlers

import (
	"log"
	"net/http"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/artyultra/tanglr/internal/database"
	"github.com/go-chi/chi"
)

func (cfg *Config) HandlerAddFriend(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	if username == "" {
		helpers.RespondWithError(w, http.StatusBadRequest, "Missing username", nil)
		return
	}
	friendUsername := chi.URLParam(r, "friendUsername")
	if friendUsername == "" {
		helpers.RespondWithError(w, http.StatusBadRequest, "Missing friend username", nil)
		return
	}

	jwtToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	_, err = auth.ValidateJWT(jwtToken, cfg.jwtSecret)

	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	dbUser, err := cfg.DB.GetUserByUsername(r.Context(), username)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get user", err)
		return
	}
	log.Println(friendUsername)

	dbFriend, err := cfg.DB.GetUserByUsername(r.Context(), friendUsername)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get friend", err)
		return
	}

	userID, friendID := helpers.NormalizeUsername(dbUser.ID, dbFriend.ID)

	err = cfg.DB.CreateFriend(r.Context(), database.CreateFriendParams{
		UserID:      userID,
		FriendID:    friendID,
		InitiatorID: dbUser.ID,
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create friend", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Friend request sent"})
}
