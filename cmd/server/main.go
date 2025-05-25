package main

import (
	"net/http"

	"portal/cmd/server/controllers"
	"portal/internal/db"
	"portal/internal/util"

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

	// API routes
	api := r.Group("/api/v1")
	{
		api.GET("/filter-types", controllers.GetFilterTypes) // Get filter types
		api.POST("/agents/auth", controllers.AgentAuth)      // Agent authentication (public)
		api.POST("/register", controllers.RegisterUser)      // User registration
		api.POST("/login", controllers.LoginUser)            // User login

		// Protected analytics endpoints
		api.Use(util.JWTMiddleware())
		api.GET("/signals", controllers.GetSignals)                     // Analytics endpoint
		api.POST("/signals", controllers.PostSignals)                   // Refactored POST handler
		api.GET("/signals/summary", controllers.GetSignalSummary)       // Aggregate stats
		api.GET("/signals/timeseries", controllers.GetSignalTimeseries) // Time-bucketed stats

		// Company management endpoints
		api.GET("/company", controllers.GetCompany)
		api.PUT("/company", controllers.UpdateCompany)
		api.GET("/company/users", controllers.ListCompanyUsers)
		api.POST("/company/invite", controllers.InviteUser)

		// Agent management endpoints
		api.GET("/agents", controllers.ListAgents)
		api.POST("/agents", controllers.CreateAgent)
		api.DELETE("/agents/:id", controllers.DeleteAgent)
		api.GET("/agents/:id/keys", controllers.ListAPIKeys)
		api.POST("/agents/:id/keys", controllers.CreateAPIKey)
		api.DELETE("/agents/:id/keys/:key_id", controllers.RevokeAPIKey)
		api.GET("/agents/:id/credentials", controllers.GetAgentCredentials)
	}

	r.Run(":8080")
}
