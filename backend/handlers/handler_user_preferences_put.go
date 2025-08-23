package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/artyultra/tanglr/internal/database"
	"github.com/google/uuid"
)

func (c *Config) HandlerPutAvatarUrl(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		AvatarUrl string `json:"avatar_url"`
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "No Authorization header found", err)
		return
	}

	claims, err := auth.ValidateJWT(token, c.jwtSecret)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Invalid token", err)
		return
	}

	userIdStr := claims.Subject
	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Invalid user id", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err = decoder.Decode(&params)
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Invalid parameters", err)
		return
	}

	err = c.DB.PutAvatarUrl(r.Context(), database.PutAvatarUrlParams{
		UserID:    userId,
		AvatarUrl: params.AvatarUrl,
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Failed to update user preferences", err)
	}

	helpers.RespondWithJSON(w, http.StatusOK, struct{}{})

}
