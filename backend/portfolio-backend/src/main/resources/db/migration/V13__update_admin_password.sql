-- V13__update_admin_password.sql
-- Update admin password to use $2b$ BCrypt format
-- Password: Admin@123

UPDATE admins
SET password = '$2b$10$slYQmyNdGzin7olVchNCcu69L5wXvmRccZP9f.aUm/nVIexptoK2e'
WHERE email = 'admin@portfolio.com';
