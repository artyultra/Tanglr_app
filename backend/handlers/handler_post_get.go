package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/artyultra/tanglr/handlers/helpers"
	"github.com/artyultra/tanglr/internal/auth"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

type Post struct {
	ID        uuid.UUID `json:"id"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"username"`
	AvatarURL string    `json:"avatar_url"`
}

func (cfg *Config) HandlerGetAllUserPosts(w http.ResponseWriter, r *http.Request) {
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

	posts := []Post{}
	for _, post := range dbPosts {
		posts = append(posts, Post{
			ID:        post.ID,
			Body:      post.Body,
			CreatedAt: post.CreatedAt,
			UpdatedAt: post.UpdatedAt,
			UserID:    post.UserID,
			Username:  post.Username,
			AvatarURL: post.UserAvatarUrl.String,
		})
	}

	helpers.RespondWithJSON(w, http.StatusOK, posts)
}

func (cfg *Config) HandlerGetAllPosts(w http.ResponseWriter, r *http.Request) {
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

	dbPosts, err := cfg.DB.GetPosts(r.Context())
	if err != nil {
		if err == sql.ErrNoRows {
			helpers.RespondWithJSON(w, http.StatusOK, []Post{})
		}
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get posts", err)
		return
	}

	var posts []Post
	for _, post := range dbPosts {
		posts = append(posts, Post{
			ID:        post.ID,
			Body:      post.Body,
			CreatedAt: post.CreatedAt,
			UpdatedAt: post.UpdatedAt,
			UserID:    post.UserID,
			Username:  post.Username,
			AvatarURL: post.AvatarUrl.String,
		})
	}

	helpers.RespondWithJSON(w, http.StatusOK, posts)
}
