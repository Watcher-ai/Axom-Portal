package db

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"portal/internal/models"
	"strings"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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
	`, sig.AgentID, sig.CustomerID, sig.Timestamp, sig.Protocol, sig.Operation, sig.Status, sig.LatencyMS, sig.Metadata, pqStringArray(sig.Alerts), sig.CPUUsage, sig.MemUsage, sig.GPUUsage, sig.DBOperation, sig.DBTable, sig.DBLatencyMS)
	return err
}

func pqStringArray(arr []string) interface{} {
	if arr == nil {
		return "{}"
	}
	return "{" + join(arr, ",") + "}"
}

func join(arr []string, sep string) string {
	if len(arr) == 0 {
		return ""
	}
	result := arr[0]
	for _, s := range arr[1:] {
		result += sep + s
	}
	return result
}

func QuerySignals(agentID, customerID, protocol, operation string, from, to time.Time) ([]models.Signal, error) {
	query := `SELECT agent_id, customer_id, timestamp, protocol, operation, status, latency_ms, metadata, alerts, cpu_usage, mem_usage, gpu_usage, db_operation, db_table, db_latency_ms FROM signals WHERE 1=1`
	args := []interface{}{}
	idx := 1

	if agentID != "" {
		query += ` AND agent_id = $` + itoa(idx)
		args = append(args, agentID)
		idx++
	}
	if customerID != "" {
		query += ` AND customer_id = $` + itoa(idx)
		args = append(args, customerID)
		idx++
	}
	if protocol != "" {
		query += ` AND protocol = $` + itoa(idx)
		args = append(args, protocol)
		idx++
	}
	if operation != "" {
		query += ` AND operation = $` + itoa(idx)
		args = append(args, operation)
		idx++
	}
	if !from.IsZero() {
		query += ` AND timestamp >= $` + itoa(idx)
		args = append(args, from)
		idx++
	}
	if !to.IsZero() {
		query += ` AND timestamp <= $` + itoa(idx)
		args = append(args, to)
		idx++
	}
	query += ` ORDER BY timestamp DESC LIMIT 1000`

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	signals := []models.Signal{}
	for rows.Next() {
		var sig models.Signal
		var alertsRaw string
		if err := rows.Scan(
			&sig.AgentID, &sig.CustomerID, &sig.Timestamp, &sig.Protocol, &sig.Operation, &sig.Status, &sig.LatencyMS, &sig.Metadata, &alertsRaw, &sig.CPUUsage, &sig.MemUsage, &sig.GPUUsage, &sig.DBOperation, &sig.DBTable, &sig.DBLatencyMS,
		); err != nil {
			return nil, err
		}
		sig.Alerts = parsePGStringArray(alertsRaw)
		signals = append(signals, sig)
	}
	return signals, nil
}

func itoa(i int) string {
	return fmt.Sprintf("%d", i)
}

func parsePGStringArray(s string) []string {
	s = strings.Trim(s, "{}")
	if s == "" {
		return nil
	}
	return strings.Split(s, ",")
}

// QuerySignalSummary returns aggregate stats for dashboard analytics.
func QuerySignalSummary(agentID, customerID, protocol, operation string, from, to time.Time) ([]map[string]interface{}, error) {
	query := `SELECT agent_id, protocol, operation, COUNT(*) as count, AVG(latency_ms) as avg_latency, SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END)::float/COUNT(*) as error_rate FROM signals WHERE 1=1`
	args := []interface{}{}
	idx := 1
	if agentID != "" {
		query += ` AND agent_id = $` + itoa(idx)
		args = append(args, agentID)
		idx++
	}
	if customerID != "" {
		query += ` AND customer_id = $` + itoa(idx)
		args = append(args, customerID)
		idx++
	}
	if protocol != "" {
		query += ` AND protocol = $` + itoa(idx)
		args = append(args, protocol)
		idx++
	}
	if operation != "" {
		query += ` AND operation = $` + itoa(idx)
		args = append(args, operation)
		idx++
	}
	if !from.IsZero() {
		query += ` AND timestamp >= $` + itoa(idx)
		args = append(args, from)
		idx++
	}
	if !to.IsZero() {
		query += ` AND timestamp <= $` + itoa(idx)
		args = append(args, to)
		idx++
	}
	query += ` GROUP BY agent_id, protocol, operation ORDER BY count DESC LIMIT 100`

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var agentID, protocol, operation string
		var count int
		var avgLatency, errorRate float64
		if err := rows.Scan(&agentID, &protocol, &operation, &count, &avgLatency, &errorRate); err != nil {
			return nil, err
		}
		results = append(results, map[string]interface{}{
			"agent_id":    agentID,
			"protocol":    protocol,
			"operation":   operation,
			"count":       count,
			"avg_latency": avgLatency,
			"error_rate":  errorRate,
		})
	}
	return results, nil
}

// QuerySignalTimeseries returns time-bucketed counts for charting.
func QuerySignalTimeseries(agentID, customerID, protocol, operation string, from, to time.Time, bucket string) ([]map[string]interface{}, error) {
	bucketExpr := "date_trunc('hour', timestamp)"
	if bucket == "day" {
		bucketExpr = "date_trunc('day', timestamp)"
	}
	query := `SELECT ` + bucketExpr + ` as bucket, COUNT(*) as count FROM signals WHERE 1=1`
	args := []interface{}{}
	idx := 1
	if agentID != "" {
		query += ` AND agent_id = $` + itoa(idx)
		args = append(args, agentID)
		idx++
	}
	if customerID != "" {
		query += ` AND customer_id = $` + itoa(idx)
		args = append(args, customerID)
		idx++
	}
	if protocol != "" {
		query += ` AND protocol = $` + itoa(idx)
		args = append(args, protocol)
		idx++
	}
	if operation != "" {
		query += ` AND operation = $` + itoa(idx)
		args = append(args, operation)
		idx++
	}
	if !from.IsZero() {
		query += ` AND timestamp >= $` + itoa(idx)
		args = append(args, from)
		idx++
	}
	if !to.IsZero() {
		query += ` AND timestamp <= $` + itoa(idx)
		args = append(args, to)
		idx++
	}
	query += ` GROUP BY bucket ORDER BY bucket ASC LIMIT 1000`

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var bucket time.Time
		var count int
		if err := rows.Scan(&bucket, &count); err != nil {
			return nil, err
		}
		results = append(results, map[string]interface{}{
			"bucket": bucket,
			"count":  count,
		})
	}
	return results, nil
}

func CreateCompany(name string) (string, error) {
	id := uuid.New().String()
	_, err := DB.Exec(`INSERT INTO companies (id, name, created_at) VALUES ($1, $2, NOW())`, id, name)
	return id, err
}

func CreateUser(companyID, email, password, role string) (string, error) {
	id := uuid.New().String()
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	_, err = DB.Exec(`INSERT INTO users (id, company_id, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`, id, companyID, email, string(hash), role)
	return id, err
}

func GetUserByEmail(email string) (*models.User, error) {
	row := DB.QueryRow(`SELECT id, company_id, email, password_hash, role, created_at FROM users WHERE email = $1`, email)
	var u models.User
	if err := row.Scan(&u.ID, &u.CompanyID, &u.Email, &u.PasswordHash, &u.Role, &u.CreatedAt); err != nil {
		return nil, err
	}
	return &u, nil
}

func GetCompanyByID(id string) (*models.Company, error) {
	row := DB.QueryRow(`SELECT id, name, created_at FROM companies WHERE id = $1`, id)
	var c models.Company
	if err := row.Scan(&c.ID, &c.Name, &c.CreatedAt); err != nil {
		return nil, err
	}
	return &c, nil
}

func UpdateCompanyName(id, name string) error {
	_, err := DB.Exec(`UPDATE companies SET name = $1 WHERE id = $2`, name, id)
	return err
}

func ListCompanyUsers(companyID string) ([]models.User, error) {
	rows, err := DB.Query(`SELECT id, company_id, email, password_hash, role, created_at FROM users WHERE company_id = $1`, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.CompanyID, &u.Email, &u.PasswordHash, &u.Role, &u.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func InviteUser(companyID, email, role string) (string, error) {
	password := randomString(12)
	return CreateUser(companyID, email, password, role)
}

func randomString(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func ListAgents(companyID string) ([]models.Agent, error) {
	rows, err := DB.Query(`SELECT id, company_id, name, created_at, client_id, client_secret, owner_id, owner_name FROM agents WHERE company_id = $1`, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var agents []models.Agent
	for rows.Next() {
		var a models.Agent
		if err := rows.Scan(&a.ID, &a.CompanyID, &a.Name, &a.CreatedAt, &a.ClientID, &a.ClientSecret, &a.OwnerID, &a.OwnerName); err != nil {
			return nil, err
		}
		agents = append(agents, a)
	}
	return agents, nil
}

func CreateAgent(companyID, name, ownerID, ownerName string) (*models.Agent, error) {
	id := uuid.New().String()
	clientID := uuid.New().String()
	agentSecret := randomString(32)
	clientSecret := randomString(32)
	createdAt := time.Now()
	_, err := DB.Exec(`INSERT INTO agents (id, company_id, name, created_at, client_id, client_secret, owner_id, owner_name, agent_secret) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		id, companyID, name, createdAt, clientID, clientSecret, ownerID, ownerName, agentSecret)
	if err != nil {
		return nil, err
	}
	agent := &models.Agent{
		ID: id, CompanyID: companyID, Name: name, CreatedAt: createdAt, ClientID: clientID, ClientSecret: clientSecret, OwnerID: ownerID, OwnerName: ownerName, AgentSecret: agentSecret,
	}
	return agent, nil
}

func GetAgentByIDAndSecret(agentID, secret string) (*models.Agent, error) {
	row := DB.QueryRow(`SELECT id, company_id, name, created_at, client_id, client_secret, owner_id, owner_name, agent_secret FROM agents WHERE id = $1 AND agent_secret = $2`, agentID, secret)
	var a models.Agent
	if err := row.Scan(&a.ID, &a.CompanyID, &a.Name, &a.CreatedAt, &a.ClientID, &a.ClientSecret, &a.OwnerID, &a.OwnerName, &a.AgentSecret); err != nil {
		return nil, err
	}
	return &a, nil
}

func DeleteAgent(companyID, agentID string) error {
	_, err := DB.Exec(`DELETE FROM agents WHERE id = $1 AND company_id = $2`, agentID, companyID)
	return err
}

// Exported API key management functions
func CreateAPIKey(agentID string) (*models.APIKey, error) {
	id := uuid.New().String()
	key := randomString(40)
	createdAt := time.Now()
	_, err := DB.Exec(`INSERT INTO api_keys (id, agent_id, key, created_at, revoked) VALUES ($1, $2, $3, $4, false)`, id, agentID, key, createdAt)
	if err != nil {
		return nil, err
	}
	return &models.APIKey{ID: id, AgentID: agentID, Key: key, CreatedAt: createdAt, Revoked: false}, nil
}

func ListAPIKeys(agentID string) ([]models.APIKey, error) {
	rows, err := DB.Query(`SELECT id, agent_id, key, created_at, revoked FROM api_keys WHERE agent_id = $1`, agentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var keys []models.APIKey
	for rows.Next() {
		var k models.APIKey
		if err := rows.Scan(&k.ID, &k.AgentID, &k.Key, &k.CreatedAt, &k.Revoked); err != nil {
			return nil, err
		}
		keys = append(keys, k)
	}
	return keys, nil
}

func RevokeAPIKey(keyID string) error {
	_, err := DB.Exec(`UPDATE api_keys SET revoked = true WHERE id = $1`, keyID)
	return err
}

func GetAgentByID(agentID string) (*models.Agent, error) {
	row := DB.QueryRow(`SELECT id, company_id, name, created_at, client_id, client_secret, owner_id, owner_name, agent_secret FROM agents WHERE id = $1`, agentID)
	var a models.Agent
	if err := row.Scan(&a.ID, &a.CompanyID, &a.Name, &a.CreatedAt, &a.ClientID, &a.ClientSecret, &a.OwnerID, &a.OwnerName, &a.AgentSecret); err != nil {
		return nil, err
	}
	return &a, nil
}
