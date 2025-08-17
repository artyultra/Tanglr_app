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

type User struct {
	ID        uuid.UUID `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	AvatarURL string    `json:"avatar_url"`
}

func (cfg *Config) HandlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type paramaters struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	params := paramaters{}
	err := decoder.Decode(&params)
	if err != nil {
		helpers.RespondWithError(w, http.StatusBadRequest, "Invalid request", err)
		return
	}

	hashedPassword, err := auth.HashPassword(params.Password)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error hashing password", err)
		return
	}

	avatarURL := "https://storage.cloud.google.com/beehive_bucket/avatar-default.svg"

	user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		Username:       params.Username,
		Email:          params.Email,
		HashedPassword: hashedPassword,
		AvatarUrl:      avatarURL,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error creating user", err)
		return
	}
	helpers.RespondWithJSON(w, http.StatusCreated, User{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		AvatarURL: avatarURL,
	})
}
