import type { WorkExperience } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './WorkExperienceSection.css';

export const WorkExperienceSection = () => {
  const { data } = usePortfolioData();
  const { i18n, t } = useTranslation();
  const experiences = ((data?.workExperiences || []) as WorkExperience[])
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const getPosition = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.positionFr || work.position) : work.position;
  };

  const getCompany = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.companyFr || work.company) : work.company;
  };

  const getDescription = (work: WorkExperience): string => {
    return i18n.language === 'fr' ? (work.descriptionFr || work.description) : work.description;
  };

  return (
    <section id="experience" className="work-experience-section">
      <div className="work-experience-container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="work-experience-title work-experience-title-white"
        >
          {t('workexperiencesubdomain.sectionTitle')}
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
                <h3 className="work-position">{getPosition(work)}</h3>
                <h4 className="work-company">{getCompany(work)}</h4>
                <div className="work-dates">
                  {work.startDate} — {work.isCurrent ? 'Present' : work.endDate}
                </div>
                <p className="work-description">{getDescription(work)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
