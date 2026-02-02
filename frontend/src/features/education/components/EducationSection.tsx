import type { Education } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './EducationSection.css';

export const EducationSection = () => {
    const { data } = usePortfolioData();
    const { i18n, t } = useTranslation();
    const educationList = (data?.educationList || []) as Education[];

    const getSchool = (edu: Education): string => {
        return i18n.language === 'fr' ? (edu.schoolFr || edu.school) : edu.school;
    };

    const getDegree = (edu: Education): string => {
        return i18n.language === 'fr' ? (edu.degreeFr || edu.degree) : edu.degree;
    };

    const getDescription = (edu: Education): string => {
        return i18n.language === 'fr' ? (edu.descriptionFr || edu.description) : edu.description;
    };

    return (
        <section id="education" className="education-section">
            <div className="education-container">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="education-title education-title-white"
                >
                    {t('educationsubdomain.sectionTitle')}
                </motion.h2>

                <div className="education-list">
                    {educationList.map((edu) => (
                        <motion.div
                            key={edu.educationId}
                            initial={false}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="education-item"
                        >
                            <h3 className="education-school">{getSchool(edu)}</h3>
                            <div className="education-degree">{getDegree(edu)}</div>
                            <p className="education-description">{getDescription(edu)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
