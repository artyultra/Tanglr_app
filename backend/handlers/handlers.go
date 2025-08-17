package handlers

import (
	"github.com/artyultra/tanglr/internal/database"
)

type Config struct {
	DB        *database.Queries
	jwtSecret string
}

func NewConfig(db *database.Queries, jwtSecret string) *Config {
	return &Config{
		DB:        db,
		jwtSecret: jwtSecret,
	}
}
