package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"portal/internal/db"
	"portal/internal/models"
	"portal/internal/util"
	"portal/cmd/server/controllers"

	"google.golang.org/api/idtoken"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config and connect DB
	cfg := util.LoadConfig()
	db.InitDB(cfg.DatabaseURL)

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/api/v1/signals", func(c *gin.Context) {
		apiKey := c.GetHeader("Authorization")
		agentID, customerID, ok := util.ValidateAPIKey(apiKey)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid API key"})
			return
		}
		var signals []models.Signal
		if err := c.ShouldBindJSON(&signals); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		for _, sig := range signals {
			sig.AgentID = agentID
			sig.CustomerID = customerID
			if err := db.StoreSignal(sig); err != nil {
				log.Printf("storeSignal error: %v", err)
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/api/login", func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Role     string `json:"role"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		// TODO: Replace with real DB lookup and password hash check
		if req.Role == "admin" && req.Username == "admin" && req.Password == "admin123" {
			c.JSON(http.StatusOK, gin.H{"username": "admin", "role": "admin"})
			return
		}
		if req.Role == "user" && req.Username == "user" && req.Password == "user123" {
			c.JSON(http.StatusOK, gin.H{"username": "user", "role": "user"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	})

	r.POST("/api/login/google", func(c *gin.Context) {
		var req struct {
			Token string `json:"token"`
			Role  string `json:"role"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
		payload, err := idtoken.Validate(context.Background(), req.Token, googleClientID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token"})
			return
		}
		email := payload.Claims["email"].(string)
		// TODO: Lookup user/admin by email and role in DB
		c.JSON(http.StatusOK, gin.H{"username": email, "role": req.Role})
	})

	// API routes
	api := r.Group("/api/v1")
	{
		api.GET("/filter-types", controllers.GetFilterTypes) // Get filter types
		api.POST("/agents", controllers.AddAgent)           // Add an agent
	}

	r.Run(":8080")
}
