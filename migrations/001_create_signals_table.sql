CREATE TABLE IF NOT EXISTS signals (
    id SERIAL PRIMARY KEY,
    agent_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    protocol TEXT,
    operation TEXT,
    status INT,
    latency_ms FLOAT,
    metadata JSONB,
    alerts TEXT[],
    cpu_usage FLOAT,
    mem_usage FLOAT,
    gpu_usage FLOAT,
    db_operation TEXT,
    db_table TEXT,
    db_latency_ms FLOAT
);
