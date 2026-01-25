import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialAPI, type Testimonial } from '../api/testimonialAPI';
import { TestimonialSubmitForm } from './TestimonialSubmitForm';
import './TestimonialsSection.css';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [autoPlayActive, setAutoPlayActive] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialAPI.getApprovedTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

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

  if (loading || testimonials.length === 0) return null;

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
          <h2 className="testimonials-title">What People <span className="testimonials-title-highlight">Say</span></h2>
          <p className="testimonials-subtitle">Feedback from clients and colleagues I've had the pleasure to work with</p>
        </motion.div>

        <div className="testimonials-carousel">
          <button onClick={handlePrev} className="carousel-btn carousel-btn-prev">
            <ChevronLeft size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.testimonialId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="testimonial-card"
            >
              <div className="testimonial-stars">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>

              <p className="testimonial-text">{current.message}</p>

              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {current.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="testimonial-name">{current.name}</h4>
                  <p className="testimonial-role">
                    {current.title} {current.company && `at `}<span className="testimonial-company">{current.company}</span>
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
            Share Your Feedback
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
            const fetchTestimonials = async () => {
              try {
                const data = await testimonialAPI.getApprovedTestimonials();
                setTestimonials(data);
              } catch (error) {
                console.error('Failed to fetch testimonials:', error);
              }
            };
            fetchTestimonials();
          }}
        />
      )}
    </section>
  );
};
