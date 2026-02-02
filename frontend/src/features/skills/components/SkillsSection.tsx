import type { Skill } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './SkillsSection.css';

export const SkillsSection = () => {
  const { data } = usePortfolioData();
  const { i18n, t } = useTranslation();
  const skills = (data?.skills || []) as Skill[];

  // Group skills by type
  const frontendSkills = skills.filter(s => s.type === 'frontend');
  const backendSkills = skills.filter(s => s.type === 'backend');
  const otherSkills = skills.filter(s => s.type === 'other');
  const allSkills = [...frontendSkills, ...backendSkills, ...otherSkills];

  const getSkillTitle = (skill: Skill): string => {
    return i18n.language === 'fr' ? (skill.titleFr || skill.title) : skill.title;
  };

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="skills-header"
        >
          <p className="skills-label">EXPERTISE</p>
          <h2 className="skills-title">{t('skillsubdomain.sectionTitle').split(' & ')[0]} & <span className="skills-gradient">{t('skillsubdomain.sectionTitle').split(' & ')[1]}</span></h2>
        </motion.div>

        <div className="skills-grid">
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
                  initial={false}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="skill-item"
                >
                  <div className="skill-header">
                    <span className="skill-name">{getSkillTitle(skill)}</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '95%' }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
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
                  initial={false}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="skill-item"
                >
                  <div className="skill-header">
                    <span className="skill-name">{getSkillTitle(skill)}</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '85%' }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Other Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="skills-column skills-column-other"
          >
            <div className="column-header">
              <div className="category-dot other"></div>
              <h3 className="column-title">Other</h3>
            </div>
            <div className="skills-list">
              {otherSkills.map((skill) => (
                <motion.div
                  key={skill.skillId}
                  initial={false}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="skill-item"
                >
                  <div className="skill-header">
                    <span className="skill-name">{getSkillTitle(skill)}</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '80%' }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Technology Ecosystem Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="tech-ecosystem"
        >
          <h3 className="ecosystem-title">Technology Ecosystem</h3>
          <div className="ecosystem-tags">
            {allSkills.map((skill) => (
              <motion.span
                key={skill.skillId}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="ecosystem-tag"
              >
                {getSkillTitle(skill)}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
