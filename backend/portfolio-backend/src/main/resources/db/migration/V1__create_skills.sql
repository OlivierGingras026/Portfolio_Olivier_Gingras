
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,

    -- Embedded SkillIdentifier
    skill_id VARCHAR(36) NOT NULL UNIQUE,

    title VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL
);