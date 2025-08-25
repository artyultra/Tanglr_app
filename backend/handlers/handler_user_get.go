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

type GetUserResponse struct {
	ID          uuid.UUID `json:"id,omitempty"`
	Username    string    `json:"username,omitempty"`
	Email       string    `json:"email,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	AvatarURL   string    `json:"avatar_url,omitempty"`
	CoverURL    string    `json:"cover_url,omitempty"`
	DarkMode    bool      `json:"dark_mode,omitempty"`
	PrivateMode bool      `json:"private_mode,omitempty"`
	Followers   int64     `json:"followers"`
	Following   int64     `json:"following"`
	Exists      bool      `json:"exists"`
}

func (cfg *Config) HandlerGetUser(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	if username == "" {
		helpers.RespondWithError(w, http.StatusBadRequest, "Missing username", nil)
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
		if err == sql.ErrNoRows {
			helpers.RespondWithJSON(w, http.StatusOK, User{Exists: false})
			return
		}
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't get user", err)
		return
	}

	user := GetUserResponse{
		ID:          dbUser.UserID,
		Email:       dbUser.Email,
		Username:    dbUser.Username,
		CreatedAt:   dbUser.UserCreatedAt,
		UpdatedAt:   dbUser.UserCreatedAt,
		AvatarURL:   dbUser.AvatarUrl.String,
		CoverURL:    dbUser.CoverUrl.String,
		DarkMode:    dbUser.DarkMode.Bool,
		PrivateMode: dbUser.PrivateMode.Bool,
		Followers:   dbUser.FollowerCount,
		Following:   dbUser.FollowingCount,
		Exists:      true,
	}

	helpers.RespondWithJSON(w, http.StatusOK, user)

}
