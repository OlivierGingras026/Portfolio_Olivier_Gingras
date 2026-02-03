import type { Project } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './ProjectsSection.css';

export const ProjectsSection = () => {
  const { data } = usePortfolioData();
  const { i18n, t } = useTranslation();
  const projects = (data?.projects || []) as Project[];

  const getProjectTitle = (project: Project): string => {
    return i18n.language === 'fr' ? (project.titleFr || project.title) : project.title;
  };

  const getProjectDescription = (project: Project): string => {
    return i18n.language === 'fr' ? (project.descriptionFr || project.description) : project.description;
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.5 }}
           className="projects-header"
        >
          <h2 className="projects-title">{t('projectsubdomain.sectionTitle')}</h2>
          <p className="projects-description">
            {i18n.language === 'fr' ? 'Un aperçu de mon travail récent, de mes projets personnels et de mes expériences.' : 'A showcase of my recent work, personal projects, and experiments.'}
          </p>
        </motion.div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <motion.div
              key={project.projectId}
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`project-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="project-image-wrapper">
                {project.imageUrl ? (
                  <>
                    <img src={project.imageUrl} alt={project.title} className="project-image" />
                  </>
                ) : (
                  <div className="project-image-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-github-link"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>

              <div className="project-info">
                <motion.div
                  initial={false}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="project-label"
                >
                  {i18n.language === 'fr' ? 'Projet en Vedette' : 'Featured Project'}
                </motion.div>
                
                <h3 className="project-title">{getProjectTitle(project)}</h3>
                <p className="project-description">{getProjectDescription(project)}</p>

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
                    {i18n.language === 'fr' ? 'Voir le Projet' : 'View Project'} →
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
