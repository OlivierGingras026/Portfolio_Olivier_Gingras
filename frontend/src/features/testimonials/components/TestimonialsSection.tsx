import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../../../shared/context/usePortfolioData';
import type { Testimonial } from '../api/testimonialAPI';
import { TestimonialSubmitForm } from './TestimonialSubmitForm';
import './TestimonialsSection.css';

export const TestimonialsSection = () => {
  const { data, refetch } = usePortfolioData();
  const { i18n, t } = useTranslation();
  const testimonials = (data?.testimonials || []) as Testimonial[];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [autoPlayActive, setAutoPlayActive] = useState(true);

  const getMessage = (testimonial: Testimonial): string => {
    return i18n.language === 'fr' ? (testimonial.messageFr || testimonial.message) : testimonial.message;
  };

  const getTitle = (testimonial: Testimonial): string => {
    return i18n.language === 'fr' ? (testimonial.titleFr || testimonial.title) : testimonial.title;
  };

  const getCompany = (testimonial: Testimonial): string | undefined => {
    return i18n.language === 'fr' ? (testimonial.companyFr || testimonial.company) : testimonial.company;
  };

  useEffect(() => {
    if (testimonials.length === 0 || !autoPlayActive) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, autoPlayActive]);

  const handlePrev = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setAutoPlayActive(true), 10000);
  };

  const handleNext = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setAutoPlayActive(true), 10000);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="testimonials-header"
        >
          <h2 className="testimonials-title">{t('testimonialsubdomain.sectionTitleMain')} <span className="testimonials-title-highlight">{t('testimonialsubdomain.sectionTitleHighlight')}</span></h2>
          <p className="testimonials-subtitle">{t('testimonialsubdomain.subtitle')}</p>
        </motion.div>

        <div className="testimonials-carousel">
          <button onClick={handlePrev} className="carousel-btn carousel-btn-prev">
            <ChevronLeft size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.testimonialId}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>

              <p className="testimonial-text">{getMessage(current)}</p>

              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {current.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="testimonial-name">{current.name}</h4>
                  <p className="testimonial-role">
                    {getTitle(current)} {getCompany(current) && `at `}<span className="testimonial-company">{getCompany(current) || ''}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={handleNext} className="carousel-btn carousel-btn-next">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="testimonials-cta">
          <button 
            onClick={() => {
              document.body.style.overflow = 'hidden';
              setShowSubmitForm(true);
            }}
            className="submit-testimonial-btn"
          >
            {t('testimonialsubdomain.shareYourFeedback')}
          </button>
        </div>
      </div>

      {showSubmitForm && (
        <TestimonialSubmitForm 
          onClose={() => {
            document.body.style.overflow = 'auto';
            setShowSubmitForm(false);
          }}
          onSuccess={() => {
            // Refresh testimonials after submission
            refetch();
          }}
        />
      )}
    </section>
  );
};
