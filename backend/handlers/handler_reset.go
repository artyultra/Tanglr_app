package handlers

import (
	"net/http"

	"github.com/artyultra/tanglr/handlers/helpers"
)

func (cfg *Config) HandlerResetDatabases(w http.ResponseWriter, r *http.Request) {
	err := cfg.DB.ResetUsersTable(r.Context())
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't reset users table", err)
		return
	}

	err = cfg.DB.ResetPostsTable(r.Context())
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't reset posts table", err)
		return
	}

	err = cfg.DB.ResetRefreshTokensTable(r.Context())
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't reset refresh tokens table", err)
		return
	}

	err = cfg.DB.ResetFriendsTable(r.Context())
	if err != nil {
		helpers.RespondWithError(w, http.StatusInternalServerError, "Couldn't reset friends table", err)
		return
	}

	helpers.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Users, Posts, and Refresh Tokens tables have been reset"})
}
