package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/artyultra/tanglr/internal/database"
)

func (cfg *Config) HandlerLogin(w http.ResponseWriter, r *http.Request) {
	log.Println("LOGIN ATTEMPT")
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type response struct {
		User
		Token        string `json:"token"`
		RefreshToken string `json:"refresh_token"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Couldn't decode parameters", err)
		return
	}

	user, err := cfg.DB.GetUserByUsername(r.Context(), params.Username)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get user", err)
		return
	}

	err = auth.CheckPassword(params.Password, user.HashedPassword)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Invalid password", err)
		return
	}

	jwtExpTime := time.Hour

	tokenString, err := auth.MakeJWT(user.UserID, user.Username, cfg.jwtSecret, jwtExpTime)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create token", err)
		return
	}

	refreshTokenString, err := auth.MakeRefreshToken()
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create refresh token", err)
		return
	}

	refreshTokenExpTime := time.Now().Add(time.Hour * 24 * 60)

	refreshToken, err := cfg.DB.CreateRefreshToken(r.Context(), database.CreateRefreshTokenParams{
		Token:     refreshTokenString,
		UserID:    user.UserID,
		ExpiresAt: refreshTokenExpTime,
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create refresh token", err)
		return
	}

	log.Println("LOGIN SUCCESS")

	helpers.RespondWithJSON(w, http.StatusOK, response{
		User: User{
			ID:        user.UserID,
			Username:  user.Username,
			Email:     user.Email,
			CreatedAt: user.UserCreatedAt,
			UpdatedAt: user.UserUpdatedAt,
			AvatarURL: user.AvatarUrl.String,
			CoverURL:  user.CoverUrl.String,
			DarkMode:  user.DarkMode.Bool,
			Exists:    true,
		},
		Token:        tokenString,
		RefreshToken: refreshToken.Token,
	})

}
