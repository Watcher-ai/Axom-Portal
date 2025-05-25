package controllers

import (
	"net/http"
	"time"

	"log"
	"portal/internal/db"
	"portal/internal/models"
	"portal/internal/util"

	"github.com/gin-gonic/gin"
)

// GetSignals handles GET /api/v1/signals with filters for analytics.
func GetSignals(c *gin.Context) {
	agentID := c.Query("agent_id")
	customerID := c.Query("customer_id")
	protocol := c.Query("protocol")
	operation := c.Query("operation")
	from := c.Query("from")
	to := c.Query("to")

	var fromTime, toTime time.Time
	var err error
	if from != "" {
		fromTime, err = time.Parse(time.RFC3339, from)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid from time"})
			return
		}
	}
	if to != "" {
		toTime, err = time.Parse(time.RFC3339, to)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid to time"})
			return
		}
	}

	signals, err := db.QuerySignals(agentID, customerID, protocol, operation, fromTime, toTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, signals)
}

// PostSignals handles POST /api/v1/signals (webhook for Observer)
func PostSignals(c *gin.Context) {
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
}

// GetSignalSummary handles GET /api/v1/signals/summary for aggregate stats.
func GetSignalSummary(c *gin.Context) {
	agentID := c.Query("agent_id")
	customerID := c.Query("customer_id")
	protocol := c.Query("protocol")
	operation := c.Query("operation")
	from := c.Query("from")
	to := c.Query("to")

	var fromTime, toTime time.Time
	var err error
	if from != "" {
		fromTime, err = time.Parse(time.RFC3339, from)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid from time"})
			return
		}
	}
	if to != "" {
		toTime, err = time.Parse(time.RFC3339, to)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid to time"})
			return
		}
	}

	summary, err := db.QuerySignalSummary(agentID, customerID, protocol, operation, fromTime, toTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, summary)
}

// GetSignalTimeseries handles GET /api/v1/signals/timeseries for time-bucketed stats.
func GetSignalTimeseries(c *gin.Context) {
	agentID := c.Query("agent_id")
	customerID := c.Query("customer_id")
	protocol := c.Query("protocol")
	operation := c.Query("operation")
	from := c.Query("from")
	to := c.Query("to")
	bucket := c.DefaultQuery("bucket", "hour") // hour, day, etc.

	var fromTime, toTime time.Time
	var err error
	if from != "" {
		fromTime, err = time.Parse(time.RFC3339, from)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid from time"})
			return
		}
	}
	if to != "" {
		toTime, err = time.Parse(time.RFC3339, to)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid to time"})
			return
		}
	}

	timeseries, err := db.QuerySignalTimeseries(agentID, customerID, protocol, operation, fromTime, toTime, bucket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, timeseries)
}
