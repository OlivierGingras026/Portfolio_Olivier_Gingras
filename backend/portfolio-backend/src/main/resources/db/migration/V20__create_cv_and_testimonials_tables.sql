-- Create CV files table
CREATE TABLE IF NOT EXISTS cv_files (
    cv_id VARCHAR(36) NOT NULL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_data BYTEA NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create index for active CV files
CREATE INDEX IF NOT EXISTS idx_cv_files_is_active ON cv_files(is_active DESC, uploaded_at DESC);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Insert sample approved testimonial
INSERT INTO testimonials (testimonial_id, name, title, company, rating, message, status, created_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Emily Chen',
    'Design Lead',
    'CreativeStudio',
    5,
    'A rare combination of technical expertise and design sensibility. The collaboration was seamless and the results speak for themselves.',
    'APPROVED',
    CURRENT_TIMESTAMP
)
ON CONFLICT (testimonial_id) DO NOTHING;

INSERT INTO testimonials (testimonial_id, name, title, company, rating, message, status, created_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Marc Dubois',
    'CTO',
    'StartupX',
    5,
    'Exceptional talent and professionalism. Delivered a complex application on time with outstanding code quality. Would definitely work together again.',
    'APPROVED',
    CURRENT_TIMESTAMP
)
ON CONFLICT (testimonial_id) DO NOTHING;
