import type { Hobby } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './HobbiesSection.css';

export const HobbiesSection = () => {
  const { data } = usePortfolioData();
  const { i18n, t } = useTranslation();
  const hobbies = (data?.hobbies || []) as Hobby[];

  const getHobbyTitle = (hobby: Hobby): string => {
    return i18n.language === 'fr' ? (hobby.titleFr || hobby.title) : hobby.title;
  };

  const getHobbyDescription = (hobby: Hobby): string => {
    return i18n.language === 'fr' ? (hobby.descriptionFr || hobby.description) : hobby.description;
  };

  return (
    <section id="hobbies" className="hobbies-section">
      <div className="hobbies-container">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="hobbies-title"
        >
          {t('hobbysubdomain.sectionTitle')}
        </motion.h2>

        <div className="hobbies-grid">
          {hobbies.map((hobby) => (
            <motion.div
              key={hobby.hobbyId}
              initial={false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="hobby-card"
            >
              <h3 className="hobby-name">{getHobbyTitle(hobby)}</h3>
              <p className="hobby-description">{getHobbyDescription(hobby)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
