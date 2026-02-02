import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Portfolio.css';

export const HeroSection = () => {
    const { t } = useTranslation();
    const scrollToContact = () => {
        const element = document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="hero-section">
            {/* Animated Background Elements */}
            <div className="hero-background">
                <div className="hero-blob hero-blob-1"></div>
                <div className="hero-blob hero-blob-2"></div>
            </div>

            <div className="hero-content">
                {/* Greeting */}
                <div className="hero-greeting">
                    <span>{t('hero.welcome')}</span>
                </div>

                {/* Main Heading */}
                <h1 className="hero-title">
                    Hi, I'm <span className="hero-gradient">{t('hero.name')}</span>
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
