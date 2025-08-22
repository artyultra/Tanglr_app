package handlers

import (
	"database/sql"

	"github.com/artyultra/tanglr/internal/database"
)

type Config struct {
	DB        *database.Queries
	DBConn    *sql.DB
	jwtSecret string
}

func NewConfig(db *database.Queries, dbConn *sql.DB, jwtSecret string) *Config {
	return &Config{
		DB:        db,
		DBConn:    dbConn,
		jwtSecret: jwtSecret,
	}
}
