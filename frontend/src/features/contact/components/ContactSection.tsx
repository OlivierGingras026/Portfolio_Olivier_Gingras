import { useEffect, useState } from 'react';
import { Mail, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { contactAPI, reachMeAPI, type ReachMeProfile } from '../api/contactAPI';
import './ContactSection.css';

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [profileData, setProfileData] = useState<ReachMeProfile | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await reachMeAPI.getProfile();
        setProfileData(profile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await contactAPI.sendMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="contact-header"
        >
          <p className="contact-label">CONTACT</p>
          <h2 className="contact-title">{i18n.language === 'fr' ? 'Construisons' : "Let's Build"} <span className="contact-title-highlight">{i18n.language === 'fr' ? 'Quelque Chose de Formidable' : 'Something Great'}</span></h2>
        </motion.div>

        {/* Content Grid */}
        <div className="contact-content">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            <h3 className="contact-info-title">Get in touch</h3>
            <p className="contact-info-description">
              {i18n.language === 'fr' ? 'Je suis toujours ouvert à discuter de nouveaux projets, d\'idées créatives ou d\'opportunités pour faire partie de votre vision.' : 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.'}
            </p>

            {/* Email Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="contact-card"
            >
              <div className="contact-card-icon">
                <Mail size={20} />
              </div>
              <div className="contact-card-content">
                <p className="contact-card-label">{t('contactsubdomain.emailMeAt')}</p>
                <p className="contact-card-value">{profileData?.email || 'Loading...'}</p>
              </div>
              <svg className="contact-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </motion.div>

            {/* Location Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="contact-card"
            >
              <div className="contact-card-icon">
                <MapPin size={20} />
              </div>
              <div className="contact-card-content">
                <p className="contact-card-label">{t('contactsubdomain.basedIn')}</p>
                <p className="contact-card-value">{profileData?.basedIn || 'Loading...'}</p>
              </div>
            </motion.div>

            {/* Availability Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="contact-card availability-card"
            >
              <div className="contact-card-icon available">
                <div className="availability-dot"></div>
              </div>
              <div className="contact-card-content">
                <p className="contact-card-label">{t('contactsubdomain.availableForWork')}</p>
                <p className="contact-card-value">{profileData?.availabilityStatus || 'Loading...'}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-form-wrapper"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="contact-success"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle size={64} className="success-icon" />
                </motion.div>
                <h3>{i18n.language === 'fr' ? 'Message Envoyé!' : 'Message Sent!'}</h3>
                <p>{i18n.language === 'fr' ? 'Merci de m\'avoir contacté. Je vous répondrai dès que possible.' : 'Thank you for reaching out. I\'ll get back to you as soon as possible.'}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}
                
                <div className="form-row">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="form-group"
                  >
                    <label htmlFor="name">{t('contactsubdomain.name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="form-group"
                  >
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="form-group"
                >
                  <label htmlFor="message">{t('contactsubdomain.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                  ></textarea>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="contact-submit"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      {t('contactsubdomain.sending')}
                    </>
                  ) : (
                    <>
                      {t('contactsubdomain.send')} <span className="send-icon">✈</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="contact-footer"
      >
        <p className="contact-copyright">© 2026 Olivier Gingras. All rights reserved.</p>
      </motion.div>
    </section>
  );
};
