import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import './Portfolio.css';

export const HeroSection = () => {
    const { t } = useTranslation();
    const titleRef = useRef<HTMLHeadingElement>(null);

    const scrollToContact = () => {
        const element = document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMouseMove = (e: MouseEvent<HTMLHeadingElement>) => {
        if (!titleRef.current) return;
        const rect = titleRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        titleRef.current.style.setProperty('--mouse-x', `${x}px`);
        titleRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="home" className="hero-section">
            {/* Animated Background Elements */}
            <div className="hero-background">
                <div className="hero-blob hero-blob-1"></div>
                <div className="hero-blob hero-blob-2"></div>
            </div>

            <div className="hero-content">
                {/* Main Heading */}
                <motion.h1 
                    ref={titleRef}
                    className="hero-title interactive-title"
                    onMouseMove={handleMouseMove}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                >
                    {t('hero.greeting')} {t('hero.name')}
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                >
                    {t('hero.subtitle')}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                >
                    <button
                        onClick={scrollToContact}
                        className="btn btn-primary"
                    >
                        {t('hero.cta')} <ArrowRight size={20} />
                    </button>
                    <button
                        onClick={() => {
                            const element = document.getElementById('projects');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn btn-secondary"
                    >
                        {t('hero.viewWork')}
                    </button>
                </motion.div>

                {/* Social Links Under Buttons */}
                <motion.div 
                    className="hero-social-links"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                    <a
                        href="https://www.linkedin.com/in/olivier-gingras-a0032b380"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-social-link"
                    >
                        <Linkedin size={20} />
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/OlivierGingras026"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-social-link"
                    >
                        <Github size={20} />
                        GitHub
                    </a>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-dot"></div>
                </div>
            </div>
        </section>
    );
};
