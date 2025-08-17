package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/artyultra/tanglr/internal/database"
	"github.com/google/uuid"
)

type Post struct {
	ID        uuid.UUID `json:"id"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"username"`
}

func (cfg *Config) HandlerCreatePost(w http.ResponseWriter, r *http.Request) {
	type paramaters struct {
		Body string `json:"body"`
	}
	type response struct {
		Post
	}
	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	claims, err := auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	userIDString := claims.Subject
	userID, err := uuid.Parse(userIDString)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}
	username := claims.Username

	decoder := json.NewDecoder(r.Body)
	params := paramaters{}
	err = decoder.Decode(&params)
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Invalid request", err)
		return
	}

	post, err := cfg.DB.CreatePost(r.Context(), database.CreatePostParams{
		Body:      params.Body,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		UserID:    userID,
		Username:  username,
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't create post", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusCreated, response{
		Post: Post{
			ID:        post.ID,
			Body:      post.Body,
			CreatedAt: post.CreatedAt,
			UpdatedAt: post.UpdatedAt,
			UserID:    post.UserID,
			Username:  post.Username,
		},
	})

}
