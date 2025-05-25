package models

import "time"

type Agent struct {
	ID           string    `json:"id"`
	CompanyID    string    `json:"company_id"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
	ClientID     string    `json:"client_id"`
	ClientSecret string    `json:"client_secret"`
	OwnerID      string    `json:"owner_id"`
	OwnerName    string    `json:"owner_name"`
	AgentSecret  string    `json:"agent_secret"`
}
