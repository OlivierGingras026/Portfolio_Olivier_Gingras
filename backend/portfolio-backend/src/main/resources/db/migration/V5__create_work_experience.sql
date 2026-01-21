
CREATE TABLE work_experience (
    id SERIAL PRIMARY KEY,

    -- Embedded WorkExperienceIdentifier
    work_experience_id VARCHAR(36) NOT NULL UNIQUE,

    company VARCHAR(120) NOT NULL,
    position VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL
);
