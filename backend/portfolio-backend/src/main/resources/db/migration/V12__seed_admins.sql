-- V12__seed_admins.sql
-- Password is hashed using BCrypt: password = "Admin@123"

INSERT INTO admins (admin_id, email, password, full_name, is_active) VALUES
(
    'j9k0l1m2-n3o4-4p5q-6r7s-8t9u0v1w2x3y',
    'admin@portfolio.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36MM3FSm',
    'Admin User',
    true
);
