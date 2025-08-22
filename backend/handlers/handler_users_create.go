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

type CreateUserResponse struct {
	ID        uuid.UUID `json:"id,omitempty"`
	Username  string    `json:"username,omitempty"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	ID        uuid.UUID `json:"id,omitempty"`
	Username  string    `json:"username,omitempty"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	AvatarURL string    `json:"avatar_url,omitempty"`
	CoverURL  string    `json:"cover_url,omitempty"`
	DarkMode  bool      `json:"dark_mode,omitempty"`
	Exists    bool      `json:"exists"`
}

func (cfg *Config) HandlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
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

	tx, err := cfg.DBConn.BeginTx(r.Context(), nil)

	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error creating transaction", err)
		return
	}

	defer tx.Rollback()

	qtx := cfg.DB.WithTx(tx)

	user, err := qtx.CreateUser(r.Context(), database.CreateUserParams{
		Username:       params.Username,
		Email:          params.Email,
		HashedPassword: hashedPassword,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	})
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error creating user", err)
		return
	}

	err = qtx.CreateUserPreferences(r.Context(), user.ID)
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error creating user preferences", err)
		return
	}

	err = tx.Commit()
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Error committing transaction", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusCreated, CreateUserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	})
}
