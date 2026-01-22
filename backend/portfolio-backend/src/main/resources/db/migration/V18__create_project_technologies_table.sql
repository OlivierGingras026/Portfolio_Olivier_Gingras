CREATE TABLE project_technologies (
    project_id INTEGER NOT NULL,
    technology VARCHAR(255) NOT NULL,
    CONSTRAINT fk_project_technologies FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);
