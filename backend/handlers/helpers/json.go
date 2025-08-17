package helpers

import (
	"encoding/json"
	"log"
	"net/http"
)

func RespondWithError(w http.ResponseWriter, status int, msg string, logError error) {
	if logError != nil {
		log.Println(logError)
	}
	if status > 499 {
		log.Printf("Responding with 5XX error: %s", msg)
	}
	type errorResponse struct {
		Error string `json:"error"`
	}
	RespondWithJSON(w, status, errorResponse{Error: msg})
}

func RespondWithJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling response: %v", err)
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(status)
	_, err = w.Write(data)
	if err != nil {
		log.Printf("Error writing response: %v", err)
		w.WriteHeader(500)
		return
	}

}
