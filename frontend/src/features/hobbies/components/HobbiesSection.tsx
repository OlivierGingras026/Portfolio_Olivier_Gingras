import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import './HobbiesSection.css';
import type { Hobby } from '../types';

export const HobbiesSection = () => {
  const { data } = usePortfolioData();
  const { i18n, t } = useTranslation();
  
  // Filter out any garbage/test data and keep only the main hobbies
  const hobbies = (data?.hobbies || [])
    .filter(h => !['efef', 'scscs'].includes(h.title))
    .slice(0, 3) as Hobby[];

  // Preload images for better caching and performance
  useEffect(() => {
    hobbies.forEach(hobby => {
      if (hobby.imageUrl) {
        const img = new Image();
        img.src = hobby.imageUrl;
      }
    });
  }, [hobbies]);

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
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.hobbyId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="hobby-card"
              style={{
                backgroundImage: hobby.imageUrl ? `url(${hobby.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
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
