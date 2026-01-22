import { useEffect, useState } from 'react';
import type { Project } from '../types';
import { projectsAPI } from '../api/projectsAPI';
import { motion } from 'framer-motion';
import './ProjectsSection.css';

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading-text">Loading projects...</div>;
  }


  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="projects-header"
        >
          <h2 className="projects-title">Featured Projects</h2>
          <p className="projects-description">
            A showcase of my recent work, personal projects, and experiments.
          </p>
        </motion.div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <motion.div
              key={project.projectId}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`project-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="project-image-wrapper">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="project-image" />
                ) : (
                  <div className="project-image-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="project-info">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="project-label"
                >
                  Featured Project
                </motion.div>
                
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="technologies-list">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="technology-badge">{tech}</span>
                    ))}
                  </div>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
