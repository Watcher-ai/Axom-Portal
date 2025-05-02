package util

import (
	"os"
	"strings"
)

type Config struct {
	DatabaseURL string
}

func LoadConfig() Config {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://user:password@localhost:5432/portal?sslmode=disable"
	}
	return Config{DatabaseURL: dbURL}
}

// Dummy API key validation (replace with DB lookup)
func ValidateAPIKey(authHeader string) (agentID, customerID string, ok bool) {
	// Expect "Bearer <key>"
	parts := strings.Fields(authHeader)
	if len(parts) == 2 && parts[0] == "Bearer" && parts[1] != "" {
		// TODO: Lookup agent/customer by API key in DB
		return "agent-uuid", "customer-uuid", true
	}
	return "", "", false
}
