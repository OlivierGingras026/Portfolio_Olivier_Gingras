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

  // Group skills by category (Frontend/Backend based on title keywords)
  const frontendSkills = skills.filter(s => 
    s.title.toLowerCase().match(/react|typescript|javascript|next|vue|tailwind|css|html|frontend/i)
  );
  const backendSkills = skills.filter(s => 
    s.title.toLowerCase().match(/node|python|java|spring|postgresql|mongodb|backend|database|docker/i)
  );

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="skills-header"
        >
          <h2 className="skills-title">Skills & Technologies</h2>
          <p className="skills-description">Tools and technologies I work with.</p>
        </motion.div>

        <div className="skills-columns">
          {/* Frontend Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}

            viewport={{ once: true }}
            className="skills-column"
          >
            <div className="column-header">
              <div className="category-dot frontend"></div>
              <h3 className="column-title">Frontend</h3>
            </div>
            <div className="skills-list">
              {frontendSkills.map((skill) => (
                <motion.div
                  key={skill.skillId}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="skill-item"
                >
                  <div className="skill-header">
                    <span className="skill-name">{skill.title}</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Backend Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}

            viewport={{ once: true }}
            className="skills-column"
          >
            <div className="column-header">
              <div className="category-dot backend"></div>
              <h3 className="column-title">Backend</h3>
            </div>
            <div className="skills-list">
              {backendSkills.map((skill) => (
                <motion.div
                  key={skill.skillId}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="skill-item"
                >
                  <div className="skill-header">
                    <span className="skill-name">{skill.title}</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
