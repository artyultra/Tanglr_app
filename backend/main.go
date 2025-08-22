package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/artyultra/tanglr/handlers"
	"github.com/artyultra/tanglr/internal/database"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	db        *database.Queries
	dbConn    *sql.DB
	jwtSecret string
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("warning: assuming default configuration. .env unreadable: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("missing PORT environment variable")
	}

	apiCfg := apiConfig{}

	dbQueries, db, cleanup, err := setupDBConn()
	if err != nil {
		log.Fatal(err)
	}
	defer cleanup()

	apiCfg.db = dbQueries
	apiCfg.dbConn = db

	jwtsecret := os.Getenv("JWT_SECRET")
	if jwtsecret == "" {
		log.Fatal("JWT_SECRET not set")
	}

	apiCfg.jwtSecret = jwtsecret

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()

	if apiCfg.db != nil {
		handlerCfg := handlers.NewConfig(apiCfg.db, apiCfg.dbConn, apiCfg.jwtSecret)

		v1Router.Post("/login", handlerCfg.HandlerLogin)

		v1Router.Post("/users", handlerCfg.HandlerCreateUser)
		v1Router.Get("/users/{username}", handlerCfg.HandlerGetUser)
		// v1Router.Get("/users/{username}/friends", handlerCfg.HandlerGetNonFriends)
		// v1Router.Get("/users/{username}/friendslist", handlerCfg.HandlerGetFriends)
		// v1Router.Post("/users/{username}/friends/{friendUsername}", handlerCfg.HandlerAddFriend)

		v1Router.Post("/posts", handlerCfg.HandlerCreatePost)
		v1Router.Get("/posts/{username}", handlerCfg.HandlerGetAllUserPosts)
		v1Router.Get("/posts", handlerCfg.HandlerGetAllPosts)

		v1Router.Post("/reset", handlerCfg.HandlerResetDatabases)

		v1Router.Post("/refresh-token", handlerCfg.HandlerRefreshToken)
		v1Router.Delete("/refresh-token", handlerCfg.HandlerRevokeRefreshToken)
	}

	router.Mount("/v1", v1Router)
	srv := &http.Server{
		Addr:        ":" + port,
		Handler:     router,
		ReadTimeout: time.Second * 15,
	}

	log.Printf("Serving on port: %s\n", port)
	log.Fatal(srv.ListenAndServe())
}
