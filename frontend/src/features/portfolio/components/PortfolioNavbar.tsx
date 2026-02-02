import { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Portfolio.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../authentication/store/authStore';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';

export const PortfolioNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeItem, setActiveItem] = useState('home');
    const [showNavbar, setShowNavbar] = useState(true);
    const navRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isAuthenticated, logout, adminUser } = useAuthStore();
    const { t, i18n } = useTranslation();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
        setActiveItem(id);
        setIsOpen(false);
        // Prevent scroll event from changing active item during smooth scroll
        setTimeout(() => {
            setActiveItem(id);
        }, 100);
    };

    const navItems = useMemo(() => [
        { label: t('navigation.home'), id: 'home' },
        { label: t('navigation.skills'), id: 'skills' },
        { label: t('navigation.projects'), id: 'projects' },
        { label: t('navigation.experience'), id: 'experience' },
        { label: t('navigation.education'), id: 'education' },
        { label: t('navigation.hobbies'), id: 'hobbies' },
        { label: t('navigation.testimonials'), id: 'testimonials' },
        { label: t('navigation.cv'), id: 'cv' },
        { label: t('navigation.contact'), id: 'contact' },
    ], [t, i18n.language]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Magnetic effect for nav items
            if (navRef.current) {
                const items = navRef.current.querySelectorAll('.navbar-floating-item');
                items.forEach((item: Element) => {
                    const element = item as HTMLElement;
                    const rect = element.getBoundingClientRect();
                    const itemCenterX = rect.left + rect.width / 2;
                    const itemCenterY = rect.top + rect.height / 2;

                    const distance = Math.sqrt(
                        Math.pow(e.clientX - itemCenterX, 2) + Math.pow(e.clientY - itemCenterY, 2)
                    );

                    const magnetRange = 100;
                    if (distance < magnetRange) {
                        const angle = Math.atan2(e.clientY - itemCenterY, e.clientX - itemCenterX);
                        const strength = (1 - distance / magnetRange) * 8;
                        const offsetX = Math.cos(angle) * strength;
                        const offsetY = Math.sin(angle) * strength;
                        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                    } else {
                        element.style.transform = 'translate(0, 0)';
                    }
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.id));
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Increased threshold to 200px to ensure clear detection
                    if (rect.top <= 200) {
                        setActiveItem(navItems[i].id);
                        break;
                    }
                }
            }
        };

        const handleModalToggle = () => {
            const modal = document.querySelector('.testimonial-form-container');
            setShowNavbar(!modal);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleModalToggle);
        const observer = new MutationObserver(handleModalToggle);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleModalToggle);
            observer.disconnect();
        };
    }, [navItems]);

    if (!showNavbar) return null;

    return (
        <nav className="navbar-morphing">
            {/* Spotlight effect */}
            <div
                className="navbar-spotlight"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                }}
            />

            <div className="navbar-floating-container">
                <div className="navbar-floating-pill" ref={navRef}>
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection('home')}
                        className="navbar-brand"
                    >
                        <span className="navbar-brand-dot">✦</span>
                        <span className="navbar-brand-text"><span className="navbar-brand-og">OG</span></span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="navbar-floating-menu">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`navbar-floating-item ${activeItem === item.id ? 'active' : ''}`}
                                style={{
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <span className="navbar-item-text">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Auth Button */}
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="navbar-cta-button"
                        >
                            <LogOut size={16} />
                            <span className="navbar-cta-text">{adminUser?.fullName}</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="navbar-cta-button"
                        >
                            <LogIn size={16} />
                            <span className="navbar-cta-text">Login</span>
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="navbar-mobile-toggle"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Floating Cards */}
            {isOpen && (
                <div className="navbar-mobile-floating">
                    <div className="navbar-mobile-grid">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`navbar-mobile-card ${activeItem === item.id ? 'active' : ''}`}
                            >
                                <span className="mobile-card-text">{item.label}</span>
                            </button>
                        ))}
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                    navigate('/');
                                }}
                                className="navbar-mobile-card logout-card"
                            >
                                <LogOut size={16} />
                                <span className="mobile-card-text">Logout</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate('/admin/login');
                                    setIsOpen(false);
                                }}
                                className="navbar-mobile-card login-card"
                            >
                                <LogIn size={16} />
                                <span className="mobile-card-text">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
