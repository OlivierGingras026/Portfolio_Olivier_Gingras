import { useEffect, useState } from 'react';
import type { Skill } from '../types';
import { skillsAPI } from '../api/skillsAPI';
import { motion } from 'framer-motion';
import './SkillsSection.css';

export const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsAPI.getAllSkills();
        setSkills(data);
      } catch (error) {
        console.error('Failed to fetch skills', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return <div className="loading-text">Loading...</div>;

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="skills-header"
        >
          <h2 className="skills-title">Technical Skills</h2>
          <p className="skills-description">Tools and technologies I work with.</p>
        </motion.div>

        <div className="skills-grid">
            {skills.map((skill, index) => (
                <motion.div
                    key={skill.skillId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="skill-card"
                >
                    <h3 className="skill-name">{skill.title}</h3>
                    <p className="skill-description">{skill.description}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
