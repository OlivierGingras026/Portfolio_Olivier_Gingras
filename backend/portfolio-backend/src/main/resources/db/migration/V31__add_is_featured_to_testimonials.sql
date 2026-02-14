-- Add is_featured column to testimonials table
ALTER TABLE testimonials
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE NOT NULL;
