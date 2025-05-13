package orm

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"portal/internal/db"
	"portal/internal/models"
	"portal/pkg/errors"
	"portal/pkg/logger"
)

var (
	agentCollection     *mongo.Collection
)

func InitCollections() {
	agentCollection = db.Client.Database("axom-web-portal").Collection("agents")
}

func AddAgent(c *gin.Context) {
	var agent models.Agent
	if err := c.BindJSON(&agent); err != nil {
		appErr := errors.NewAppError(http.StatusBadRequest, "Invalid input", err)
		logger.Log.Error(appErr)
		c.JSON(appErr.Code, gin.H{"error": appErr.Message})
		return
	}
	agent.ID = primitive.NewObjectID()
	_, err := agentCollection.InsertOne(context.Background(), agent)
	if err != nil {
		appErr := errors.NewAppError(http.StatusInternalServerError, "Failed to create agent", err)
		logger.Log.Error(appErr)
		c.JSON(appErr.Code, gin.H{"error": appErr.Message})
		return
	}
	c.JSON(http.StatusCreated, agent)
}