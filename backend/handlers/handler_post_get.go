package handlers

import (
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

type PostDisplay struct {
	ID            uuid.UUID `json:"id"`
	Body          string    `json:"body"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	UserID        uuid.UUID `json:"user_id"`
	Username      string    `json:"username"`
	UserAvatarURL string    `json:"user_avatar_url"`
}

func (cfg *Config) HandlerGetAllPosts(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	if username == "" {
		helpers.RespondWithError(w, http.StatusBadRequest, "Missing username", nil)
		return
	}

	dbPosts, err := cfg.DB.GetPostsByUsername(r.Context(), username)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get posts", err)
		return
	}

	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	_, err = auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		helpers.RespondWithError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid token", err)
		return
	}

	posts := []PostDisplay{}
	for _, post := range dbPosts {
		posts = append(posts, PostDisplay{
			ID:            post.ID,
			Body:          post.Body,
			CreatedAt:     post.CreatedAt,
			UpdatedAt:     post.UpdatedAt,
			UserID:        post.UserID,
			Username:      post.Username,
			UserAvatarURL: post.AvatarUrl,
		})
	}

	helpers.RespondWithJSON(w, http.StatusOK, posts)
}
