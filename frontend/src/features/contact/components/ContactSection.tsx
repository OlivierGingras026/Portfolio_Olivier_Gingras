import { useEffect, useState } from 'react';
import { Mail, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { contactAPI, reachMeAPI, type ReachMeProfile } from '../api/contactAPI';
import { APIError } from '../../../shared/api/errorHandler';
import './ContactSection.css';

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  
  // Character limits
  const MAX_NAME_LENGTH = 100;
  const MAX_EMAIL_LENGTH = 255;
  const MAX_MESSAGE_CHARACTERS = 1000;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [charCounts, setCharCounts] = useState({
    name: 0,
    email: 0,
    message: 0
  });
  const [profileData, setProfileData] = useState<ReachMeProfile | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number>(0);

  // Compute the displayed error message based on error type and current language
  const displayError = errorType ? (
    errorType === 'rate_limit_error' 
      ? t('contactsubdomain.rateLimitError')
      : errorType
  ) : null;

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

  // Countdown timer for rate limit
  useEffect(() => {
    if (retryAfterSeconds <= 0) return;

    const timer = setInterval(() => {
      setRetryAfterSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfterSeconds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input - remove SQL injection patterns
    const sanitizedValue = value.replace(/(--|;|\*|\/|xp_|sp_)/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Update character counts
    setCharCounts(prev => ({
      ...prev,
      [name]: sanitizedValue.length
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorType(null);

    // Validate character limits
    if (charCounts.name > MAX_NAME_LENGTH) {
      setErrorType(`Name must not exceed ${MAX_NAME_LENGTH} characters (currently ${charCounts.name} characters)`);
      setIsLoading(false);
      return;
    }
    if (charCounts.email > MAX_EMAIL_LENGTH) {
      setErrorType(`Email must not exceed ${MAX_EMAIL_LENGTH} characters`);
      setIsLoading(false);
      return;
    }
    if (charCounts.message > MAX_MESSAGE_CHARACTERS) {
      setErrorType(`Message must not exceed ${MAX_MESSAGE_CHARACTERS} characters (currently ${charCounts.message} characters)`);
      setIsLoading(false);
      return;
    }

    try {
      await contactAPI.sendMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setCharCounts({ name: 0, email: 0, message: 0 });
      
      // Reset after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      let errorKey = 'Failed to send message. Please try again.';
      let retryAfter = 0;
      
      if (err instanceof APIError) {
        if (err.message === 'rate_limit_error') {
          errorKey = 'rate_limit_error';
          retryAfter = err.retryAfterSeconds || 0;
          setRetryAfterSeconds(retryAfter);
        } else {
          errorKey = err.message;
        }
      } else if (err instanceof Error) {
        errorKey = err.message;
      }
      setErrorType(errorKey);
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
            <h3 className="contact-info-title">{t('contactsubdomain.getInTouch')}</h3>
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
                <p className="contact-card-value">
                  {i18n.language === 'fr' 
                    ? (profileData?.availabilityStatusFr || profileData?.availabilityStatus || 'Loading...')
                    : (profileData?.availabilityStatus || 'Loading...')}
                </p>
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
                {displayError && (
                  <div className="form-error">
                    <div>{displayError}</div>
                    {errorType === 'rate_limit_error' && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                        {i18n.language === 'fr' 
                          ? `Réessayez dans ${retryAfterSeconds || 1200}s` 
                          : `Try again in ${retryAfterSeconds || 1200}s`}
                      </div>
                    )}
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
                      maxLength={MAX_NAME_LENGTH}
                      required
                    />
                    <div className="form-counter" style={{ color: charCounts.name > MAX_NAME_LENGTH ? '#ef4444' : '#cbd5e1' }}>
                      {t('common.characters')}: {charCounts.name} / {MAX_NAME_LENGTH}
                    </div>
                    {charCounts.name > MAX_NAME_LENGTH && <span style={{ color: '#ef4444' }}>Exceeds limit by {charCounts.name - MAX_NAME_LENGTH} characters</span>}
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
                      maxLength={MAX_EMAIL_LENGTH}
                      required
                    />
                    <div className="form-counter" style={{ color: charCounts.email > MAX_EMAIL_LENGTH ? '#ef4444' : '#cbd5e1' }}>
                      {t('common.characters')}: {charCounts.email} / {MAX_EMAIL_LENGTH}
                    </div>
                    {charCounts.email > MAX_EMAIL_LENGTH && <span style={{ color: '#ef4444' }}>Exceeds limit by {charCounts.email - MAX_EMAIL_LENGTH} characters</span>}
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
                    placeholder={t('contactsubdomain.tellMeAboutProject')}
                    rows={5}
                    maxLength={MAX_MESSAGE_CHARACTERS}
                    required
                  ></textarea>
                  <div className="form-counter" style={{ color: charCounts.message > MAX_MESSAGE_CHARACTERS ? '#ef4444' : '#cbd5e1' }}>
                    {t('common.characters')}: {charCounts.message} / {MAX_MESSAGE_CHARACTERS}
                  </div>
                  {charCounts.message > MAX_MESSAGE_CHARACTERS && <span style={{ color: '#ef4444' }}>Exceeds limit by {charCounts.message - MAX_MESSAGE_CHARACTERS} characters</span>}
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
