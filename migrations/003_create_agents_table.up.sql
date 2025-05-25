CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    client_id UUID UNIQUE NOT NULL,
    client_secret TEXT NOT NULL,
    owner_id UUID REFERENCES users(id),
    owner_name TEXT
); 