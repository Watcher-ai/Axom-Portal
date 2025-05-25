-- Create a company
INSERT INTO companies (id, name, created_at)
VALUES (
    'd0dfd7ae-50a9-47f5-b799-41b6f7b2a387',
    'Default Company',
    NOW()
);

-- Create an admin user (password: admin123)
INSERT INTO users (id, company_id, email, password_hash, role, created_at)
VALUES (
    'c413b198-b684-4c40-b055-18bed64470d1',
    'd0dfd7ae-50a9-47f5-b799-41b6f7b2a387',
    'jha.vishesh@gmail.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    NOW()
); 