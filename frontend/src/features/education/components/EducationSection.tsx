import type { Education } from '../types';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import { motion } from 'framer-motion';
import './EducationSection.css';

export const EducationSection = () => {
    const { data } = usePortfolioData();
    const educationList = (data?.educationList || []) as Education[];

    return (
        <section id="education" className="education-section">
            <div className="education-container">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="education-title education-title-white"
                >
                    Education
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
                            <h3 className="education-school">{edu.school}</h3>
                            <div className="education-degree">{edu.degree}</div>
                            <p className="education-description">{edu.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
