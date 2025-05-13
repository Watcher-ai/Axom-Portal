package controllers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "portal/internal/models"
    "portal/internal/db"
    "portal/internal/util"
)

// GetFilterTypes returns static filter types
func GetFilterTypes(c *gin.Context) {
    filterTypes := []string{"Type 1", "Type 2", "Type 3"}
    c.JSON(http.StatusOK, gin.H{"filterTypes": filterTypes})
}

// AddAgent adds a new agent and generates clientId and clientSecret
func AddAgent(c *gin.Context) {
	var req struct {
        Identifier     string `json:"identifier" binding:"required"`
        OwnerId        string `json:"ownerId" binding:"required"`
        OwnerName      string `json:"ownerName" binding:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

	// Generate UUIDs for ClientId and OwnerId
	clientId := uuid.New()
	ownerId, err := uuid.Parse(req.OwnerId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OwnerId"})
		return
	}

	// Create agent model
	agent := models.Agent{
		Identifier:   req.Name,
		ClientId:     clientId,
		ClientSecret: uuid.New().String(), // Example secret generation
		OwnerId:      ownerId,
		OwnerName:    req.OwnerName,
	}

	// Store agent in the database
	if err := db.StoreAgent(agent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store agent"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Agent added successfully",
		"clientId":     clientId,
		"clientSecret": agent.ClientSecret,
	})
}