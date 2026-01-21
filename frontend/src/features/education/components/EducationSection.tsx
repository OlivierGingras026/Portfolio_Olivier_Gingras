import { useEffect, useState } from 'react';
import type { Education } from '../types';
import { educationAPI } from '../api/educationAPI';
import { motion } from 'framer-motion';
import './EducationSection.css';

export const EducationSection = () => {
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const data = await educationAPI.getAllEducation();
                setEducationList(data);
            } catch (error) {
                console.error("Failed to fetch education", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEducation();
    }, []);

    if (loading) return null;

    return (
        <section id="education" className="education-section">
            <div className="education-container">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="education-title"
                >
                    Education
                </motion.h2>

                <div className="education-list">
                    {educationList.map((edu, index) => (
                        <motion.div
                            key={edu.educationId}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
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
