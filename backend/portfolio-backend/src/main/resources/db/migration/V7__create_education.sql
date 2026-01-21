
CREATE TABLE education (
    id SERIAL PRIMARY KEY,

    -- Embedded EducationIdentifier
    education_id VARCHAR(36) NOT NULL UNIQUE,

    school VARCHAR(120) NOT NULL,
    degree VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_currently_studying BOOLEAN NOT NULL
);
