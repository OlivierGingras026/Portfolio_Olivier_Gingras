import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import './Portfolio.css';

export const HeroSection = () => {
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
                    <span>Welcome to my portfolio</span>
                </div>

                {/* Main Heading */}
                <h1 className="hero-title">
                    Hi, I'm <span className="hero-gradient">Olivier Gingras</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle">
                    Full-stack developer passionate about building innovative web applications with clean code and modern technologies
                </p>

                {/* CTA Buttons */}
                <div className="hero-buttons">
                    <button
                        onClick={scrollToContact}
                        className="btn btn-primary"
                    >
                        Get In Touch <ArrowRight size={20} />
                    </button>
                    <button
                        onClick={() => {
                            const element = document.getElementById('projects');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn btn-secondary"
                    >
                        View My Work
                    </button>
                </div>

                {/* Social Links */}
                <div className="hero-social">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <Github size={24} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <Linkedin size={24} />
                    </a>
                    <a
                        href="mailto:contact@oliviergingras.com"
                        className="social-link"
                    >
                        <Mail size={24} />
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
