import type { Hobby } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { motion } from 'framer-motion';
import './HobbiesSection.css';

export const HobbiesSection = () => {
  const { data } = usePortfolioData();
  const hobbies = (data?.hobbies || []) as Hobby[];

  return (
    <section id="hobbies" className="hobbies-section">
      <div className="hobbies-container">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="hobbies-title"
        >
          Interests & Hobbies
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
              <h3 className="hobby-name">{hobby.title}</h3>
              <p className="hobby-description">{hobby.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
