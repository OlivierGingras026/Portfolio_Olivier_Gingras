-- Increase image_url column size in projects table to support base64-encoded images
ALTER TABLE projects
    ALTER COLUMN image_url TYPE VARCHAR(5000000);
