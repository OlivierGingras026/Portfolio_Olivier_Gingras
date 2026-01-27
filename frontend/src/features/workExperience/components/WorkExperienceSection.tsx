import type { WorkExperience } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { motion } from 'framer-motion';
import './WorkExperienceSection.css';

export const WorkExperienceSection = () => {
  const { data } = usePortfolioData();
  const experiences = ((data?.workExperiences || []) as WorkExperience[])
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <section id="experience" className="work-experience-section">
      <div className="work-experience-container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="work-experience-title work-experience-title-white"
        >
          Work Experience
        </motion.h2>

        <div className="work-experience-list">
          {experiences.map((work) => (
            <motion.div
              key={work.workExperienceId}
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="work-experience-item"
            >
              <div className="work-experience-content">
                <h3 className="work-position">{work.position}</h3>
                <h4 className="work-company">{work.company}</h4>
                <div className="work-dates">
                  {work.startDate} — {work.isCurrent ? 'Present' : work.endDate}
                </div>
                <p className="work-description">{work.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
