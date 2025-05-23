package db

import (
	"database/sql"
	"log"
	"strings"

	"portal/internal/models"

	"github.com/lib/pq"
)

var DB *sql.DB

func InitDB(url string) {
	var err error
	DB, err = sql.Open("postgres", url)
	if err != nil {
		log.Fatalf("DB open error: %v", err)
	}
	if err := DB.Ping(); err != nil {
		log.Fatalf("DB ping error: %v", err)
	}
}

func StoreSignal(sig models.Signal) error {
	_, err := DB.Exec(`
		INSERT INTO signals 
		(agent_id, customer_id, timestamp, protocol, operation, status, latency_ms, metadata, alerts, cpu_usage, mem_usage, gpu_usage, db_operation, db_table, db_latency_ms)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
	`, sig.AgentID, sig.CustomerID, sig.Timestamp, sig.Protocol, sig.Operation, sig.Status, sig.LatencyMS, sig.Metadata, pq.Array(sig.Alerts), sig.CPUUsage, sig.MemUsage, sig.GPUUsage, sig.DBOperation, sig.DBTable, sig.DBLatencyMS)
	return err
}

// pqStringArray is no longer needed with pq.Array, but can be kept for reference
func pqStringArray(arr []string) interface{} {
	if arr == nil {
		return "{}"
	}
	return "{" + strings.Join(arr, ",") + "}"
}
