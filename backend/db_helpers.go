package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/artyultra/tanglr/internal/database"
	_ "github.com/lib/pq"
)

func setupDBConn() (*database.Queries, func(), error) {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return nil, nil, fmt.Errorf("missing DATABASE_URL environment variable")
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to open database connection: %v", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, nil, fmt.Errorf("failed to ping database: %v", err)
	}

	dbQueries := database.New(db)
	log.Println("Connected to PostgreSQL database")

	cleanup := func() {
		if err := db.Close(); err != nil {
			log.Printf("failed to close database connection: %v", err)
		}
	}

	return dbQueries, cleanup, nil
}
