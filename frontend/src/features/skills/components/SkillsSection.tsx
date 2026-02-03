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

  const categoryConfigs = [
    { type: 'frontend', title: 'Frontend', skills: frontendSkills, color: 'frontend' },
    { type: 'backend', title: 'Backend', skills: backendSkills, color: 'backend' },
    { type: 'other', title: 'Other', skills: otherSkills, color: 'other' },
  ];

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
          <h2 className="skills-title">
            {t('skillsubdomain.sectionTitle').split(' & ')[0]} & 
            <span className="skills-gradient">{t('skillsubdomain.sectionTitle').split(' & ')[1]}</span>
          </h2>
          <p className="skills-subtitle">
            {i18n.language === 'fr' 
              ? 'Maîtrise professionnelle dans différents domaines technologiques' 
              : 'Professional mastery across diverse technological domains'}
          </p>
        </motion.div>

        <div className="skills-showcase">
          {categoryConfigs.map((category, categoryIndex) => (
            <motion.div
              key={category.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="skill-category"
            >
              <div className="category-header">
                <div className={`category-icon ${category.color}`}>
                  <div className="icon-inner"></div>
                </div>
                <h3 className="category-name">{category.title}</h3>
                <span className="skill-count">{category.skills.length}</span>
              </div>

              <div className="category-skills">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.skillId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: skillIndex * 0.03 }}
                    className="skill-pill"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className={`skill-dot ${category.color}`}></div>
                    <span className="skill-name">{getSkillTitle(skill)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Ecosystem Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="tech-ecosystem"
        >
          <h3 className="ecosystem-title">
            {i18n.language === 'fr' ? 'Écosystème Technologique' : 'Technology Ecosystem'}
          </h3>
          <div className="ecosystem-grid">
            {allSkills.map((skill, index) => (
              <motion.div
                key={skill.skillId}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.05 }}
                whileHover={{ scale: 1.08 }}
                className={`ecosystem-badge ${skill.type}`}
              >
                {getSkillTitle(skill)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
