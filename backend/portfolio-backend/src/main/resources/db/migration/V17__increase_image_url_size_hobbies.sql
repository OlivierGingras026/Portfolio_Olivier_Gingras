-- Increase image_url column size in hobbies table to support base64-encoded images
ALTER TABLE hobbies
    ALTER COLUMN image_url TYPE VARCHAR(5000000);
