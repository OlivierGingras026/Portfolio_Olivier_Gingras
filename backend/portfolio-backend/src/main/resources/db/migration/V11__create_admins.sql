
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,

    -- Embedded AdminIdentifier
    admin_id VARCHAR(36) NOT NULL UNIQUE,

    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);
