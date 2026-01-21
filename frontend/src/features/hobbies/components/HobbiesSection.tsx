import { useEffect, useState } from 'react';
import type { Hobby } from '../types';
import { hobbiesAPI } from '../api/hobbiesAPI';
import { motion } from 'framer-motion';
import './HobbiesSection.css';

export const HobbiesSection = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const data = await hobbiesAPI.getAllHobbies();
        setHobbies(data);
      } catch (error) {
        console.error('Failed to fetch hobbies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHobbies();
  }, []);

  if (loading) return null;

  return (
    <section id="hobbies" className="hobbies-section">
      <div className="hobbies-container">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hobbies-title"
        >
          Interests & Hobbies
        </motion.h2>

        <div className="hobbies-grid">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.hobbyId}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
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
