-- Add type column to skills table
ALTER TABLE skills ADD COLUMN type VARCHAR(20) DEFAULT 'OTHER' NOT NULL;

-- Create index for type
CREATE INDEX idx_skills_type ON skills(type);
