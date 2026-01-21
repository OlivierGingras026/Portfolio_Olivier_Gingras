import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Portfolio.css';

export const PortfolioNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    const navItems = [
        { label: 'Home', id: 'home' },
        { label: 'Skills', id: 'skills' },
        { label: 'Projects', id: 'projects' },
        { label: 'Experience', id: 'experience' },
        { label: 'Education', id: 'education' },
        { label: 'Hobbies', id: 'hobbies' },
        { label: 'Contact', id: 'contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <button
                    onClick={() => scrollToSection('home')}
                    className="navbar-logo"
                >
                    OG
                </button>

                {/* Desktop Navigation */}
                <div className="navbar-menu">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="navbar-item"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="navbar-toggle"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar-mobile">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="navbar-mobile-item"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};
