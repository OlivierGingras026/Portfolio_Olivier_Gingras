-- V12__seed_admins.sql
-- Admin account for portfolio
-- Password hash: BCrypt encoded

INSERT INTO admins (admin_id, email, password, full_name, is_active) 
VALUES (
    'j9k0l1m2-n3o4-4p5q-6r7s-8t9u0v1w2x3y',
    'OG@Admin',
    '$2b$10$adztoo1CeBxQTXGFmYPzPukTPBtLWu/Th1E6HY1FDhn4n3pj.elUS',
    'Admin User',
    true
)
ON CONFLICT (email) DO NOTHING;
