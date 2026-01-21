
CREATE TABLE hobbies (
    id SERIAL PRIMARY KEY,

    -- Embedded HobbyIdentifier
    hobby_id VARCHAR(36) NOT NULL UNIQUE,

    title VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    image_url VARCHAR(500) NOT NULL
);
