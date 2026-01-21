import { useState } from 'react';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import './Portfolio.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../authentication/store/authStore';

export const PortfolioNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout, adminUser } = useAuthStore();

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

                {/* Login/Logout Button */}
                {isAuthenticated ? (
                    <div className="navbar-auth">
                        <span className="navbar-user-name">{adminUser?.fullName}</span>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="navbar-logout"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="navbar-login"
                    >
                        <LogIn size={18} />
                        Login
                    </button>
                )}

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
                    {isAuthenticated ? (
                        <>
                            <div className="navbar-mobile-user">
                                <span>{adminUser?.fullName}</span>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                    navigate('/');
                                }}
                                className="navbar-mobile-logout"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                navigate('/admin/login');
                                setIsOpen(false);
                            }}
                            className="navbar-mobile-login"
                        >
                            <LogIn size={18} />
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};
