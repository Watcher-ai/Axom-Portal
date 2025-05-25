package controllers

import (
	"net/http"

	"portal/internal/db"

	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// GetFilterTypes returns static filter types
func GetFilterTypes(c *gin.Context) {
	filterTypes := []string{"Type 1", "Type 2", "Type 3"}
	c.JSON(http.StatusOK, gin.H{"filterTypes": filterTypes})
}

func ListAgents(c *gin.Context) {
	companyID := c.GetString("company_id")
	agents, err := db.ListAgents(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, agents)
}

func CreateAgent(c *gin.Context) {
	companyID := c.GetString("company_id")
	ownerID := c.GetString("user_id")
	if ownerID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id missing from token"})
		return
	}
	ownerName := c.GetString("email")
	var req struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid name"})
		return
	}
	agent, err := db.CreateAgent(companyID, req.Name, ownerID, ownerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, agent)
}

func DeleteAgent(c *gin.Context) {
	companyID := c.GetString("company_id")
	agentID := c.Param("id")
	if err := db.DeleteAgent(companyID, agentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func ListAPIKeys(c *gin.Context) {
	agentID := c.Param("id")
	keys, err := db.ListAPIKeys(agentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, keys)
}

func CreateAPIKey(c *gin.Context) {
	companyID := c.GetString("company_id")
	agentID := c.Param("id")

	// Check if agent exists and belongs to the user's company
	agent, err := db.GetAgentByID(agentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "agent not found"})
		return
	}
	if agent.CompanyID != companyID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	key, err := db.CreateAPIKey(agentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, key)
}

func RevokeAPIKey(c *gin.Context) {
	keyID := c.Param("key_id")
	if err := db.RevokeAPIKey(keyID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "revoked"})
}

func AgentAuth(c *gin.Context) {
	var req struct {
		AgentID string `json:"agent_id"`
		Secret  string `json:"secret"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.AgentID == "" || req.Secret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	agent, err := db.GetAgentByIDAndSecret(req.AgentID, req.Secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "devsecret"
	}
	claims := jwt.MapClaims{
		"agent_id":   agent.ID,
		"company_id": agent.CompanyID,
		"exp":        time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": tokenStr})
}

func GetAgentCredentials(c *gin.Context) {
	companyID := c.GetString("company_id")
	agentID := c.Param("id")
	agent, err := db.GetAgentByID(agentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "agent not found"})
		return
	}
	if agent.CompanyID != companyID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	c.JSON(http.StatusOK, agent)
}
