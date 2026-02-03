import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
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
                <h1 
                    ref={titleRef}
                    className="hero-title interactive-title"
                    onMouseMove={handleMouseMove}
                >
                    {t('hero.greeting')} {t('hero.name')}
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle">
                    {t('hero.subtitle')}
                </p>

                {/* CTA Buttons */}
                <div className="hero-buttons">
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
                </div>

                {/* Social Links Under Buttons */}
                <div className="hero-social-links">
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
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-dot"></div>
                </div>
            </div>
        </section>
    );
};
