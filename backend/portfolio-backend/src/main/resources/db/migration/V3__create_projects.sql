
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,

    -- Embedded ProjectIdentifier
    project_id VARCHAR(36) NOT NULL UNIQUE,

    title VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    url VARCHAR(500) NOT NULL,
    image_url VARCHAR(500) NOT NULL
);
