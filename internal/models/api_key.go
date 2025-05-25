package models

import "time"

type APIKey struct {
	ID        string    `json:"id"`
	AgentID   string    `json:"agent_id"`
	Key       string    `json:"key"`
	CreatedAt time.Time `json:"created_at"`
	Revoked   bool      `json:"revoked"`
}
