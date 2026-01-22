-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    message_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);

-- Create reach_me_profile table
CREATE TABLE IF NOT EXISTS reach_me_profile (
    profile_id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    based_in VARCHAR(255) NOT NULL,
    availability_status TEXT NOT NULL
);

-- Insert default profile
INSERT INTO reach_me_profile (profile_id, email, based_in, availability_status)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'ogingras013@gmail.com',
    'Montreal, QC, Canada',
    'Currently accepting new projects. Typical response time: < 24 hours.'
)
ON CONFLICT (profile_id) DO NOTHING;
