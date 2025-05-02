// Axom Insight - Signal model
package models

import (
	"encoding/json"
	"time"
)

type Signal struct {
	AgentID     string          `json:"-"`
	CustomerID  string          `json:"-"`
	Timestamp   time.Time       `json:"timestamp"`
	Protocol    string          `json:"protocol"`
	Operation   string          `json:"operation"`
	Status      int             `json:"status"`
	LatencyMS   float64         `json:"latency_ms"`
	Metadata    json.RawMessage `json:"metadata"` // Proper JSON for Postgres JSONB
	Alerts      []string        `json:"alerts"`
	CPUUsage    float64         `json:"cpu_usage"`
	MemUsage    float64         `json:"mem_usage"`
	GPUUsage    float64         `json:"gpu_usage"`
	DBOperation string          `json:"db_operation"`
	DBTable     string          `json:"db_table"`
	DBLatencyMS float64         `json:"db_latency_ms"`
}
