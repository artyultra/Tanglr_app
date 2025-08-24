package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
)

type Response struct {
	AccessToken string `json:"access_token"`
}

func (cfg *Config) HandlerRefreshToken(w http.ResponseWriter, r *http.Request) {
	log.Println("Refreshing token")
	authHeader, err := auth.AuthHeaderHelper(w, r)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token AUTHHELPER", err)
		return
	}

	refreshToken, err := cfg.DB.GetRefreshToken(r.Context(), authHeader)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	user, err := cfg.DB.GetUserByRefreshToken(r.Context(), refreshToken.Token)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "User not found", err)
		return
	}

	newAccessToken, err := auth.MakeJWT(user.ID, user.Username, cfg.jwtSecret, time.Hour)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create token", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusOK, Response{
		AccessToken: newAccessToken,
	})

}

func (cfg *Config) HandlerRevokeRefreshToken(w http.ResponseWriter, r *http.Request) {
	authshader, err := auth.AuthHeaderHelper(w, r)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	err = cfg.DB.RevokeRefreshToken(r.Context(), authshader)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't revoke token", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusNoContent, nil)

}
