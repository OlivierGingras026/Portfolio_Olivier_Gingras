import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { testimonialAPI, type TestimonialRequest } from '../api/testimonialAPI';
import { APIError } from '../../../shared/api/errorHandler';
import './TestimonialSubmitForm.css';
import React from 'react';

interface TestimonialSubmitFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const TestimonialSubmitForm = ({ onSuccess, onClose }: TestimonialSubmitFormProps) => {
  const { t, i18n } = useTranslation();
  const MAX_CHARACTERS = 1000;
  
  const [formData, setFormData] = useState<TestimonialRequest>({
    name: '',
    title: '',
    company: '',
    rating: 5,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number>(0);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [rateLimitFetched, setRateLimitFetched] = useState(false);

  // Compute the displayed error message based on error type and current language
  const displayError = useMemo(() => {
    return errorType ? (
      errorType === 'rate_limit_error' 
        ? t('contactsubdomain.rateLimitError')
        : errorType
    ) : null;
  }, [errorType, i18n.language, t]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch rate limit status on mount
  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const status = await testimonialAPI.getRateLimitStatus();
        if (status.isLimited) {
          setRateLimitError(true);
          setRetryAfterSeconds(status.secondsUntilReset);
        }
      } catch (err) {
        console.error('Failed to fetch rate limit status:', err);
      } finally {
        setRateLimitFetched(true);
      }
    };
    fetchRateLimit();
  }, []);

  // Countdown timer for rate limit - stable version
  useEffect(() => {
    if (!rateLimitError) return;

    const timer = setInterval(() => {
      setRetryAfterSeconds(prev => {
        const newValue = Math.max(0, prev - 1);
        if (newValue === 0) {
          setRateLimitError(false);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input - remove SQL injection attempts
    let sanitizedValue = value;
    if (typeof sanitizedValue === 'string') {
      sanitizedValue = sanitizedValue.replace(/(--|;|\*|\/|xp_|sp_)/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(sanitizedValue) : sanitizedValue
    }));
    
    // Update character count for message
    if (name === 'message') {
      setCharCount(sanitizedValue.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorType(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (formData.name.length > 100) {
        throw new Error('Name must not exceed 100 characters');
      }
      
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (formData.title.length > 100) {
        throw new Error('Title must not exceed 100 characters');
      }
      
      if (formData.company && formData.company.length > 100) {
        throw new Error('Company must not exceed 100 characters');
      }
      
      if (!formData.message.trim()) {
        throw new Error('Message is required');
      }
      if (charCount > MAX_CHARACTERS) {
        throw new Error(`Message must not exceed ${MAX_CHARACTERS} characters (currently ${charCount} characters)`);
      }
      
      if (formData.rating < 1 || formData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Submit
      await testimonialAPI.submitTestimonial({
        name: formData.name,
        title: formData.title,
        company: formData.company || undefined,
        rating: formData.rating,
        message: formData.message
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        title: '',
        company: '',
        rating: 5,
        message: ''
      });

      // Close after 2 seconds
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof APIError) {
        if (err.statusCode === 429) {
          setRateLimitError(true);
          // Fetch the actual remaining time from backend instead of using error default
          try {
            const status = await testimonialAPI.getRateLimitStatus();
            setRetryAfterSeconds(status.secondsUntilReset);
          } catch (statusErr) {
            // Fallback to error's value if fetch fails
            setRetryAfterSeconds(err.retryAfterSeconds || 60);
          }
          setErrorType(null);
        } else {
          setErrorType(err.message);
          setRateLimitError(false);
        }
      } else if (err instanceof Error) {
        setErrorType(err.message);
        setRateLimitError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonial-form-container">
      <div className="testimonial-form">
        <div className="form-header">
          <h3>{t('testimonialsubdomain.shareYourFeedback')}</h3>
          <p>{t('testimonialsubdomain.helpOthers')}</p>
        </div>

        {success ? (
          <div className="success-message">
            <div className="checkmark">✓</div>
            <h4>{t('testimonialsubdomain.thankyouForFeedback')}</h4>
            <p>{t('testimonialsubdomain.feedbackWillBeReviewed')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {rateLimitError && (
              <div className="error-message" style={{ backgroundColor: '#7f1d1d', borderColor: '#dc2626' }}>
                <div>{i18n.language === 'fr' ? 'Limite atteinte: 100 témoignages par 12 heures' : 'Limit reached: 100 testimonials per 12 hours'}</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  {i18n.language === 'fr' ? 'Réessayez dans' : 'Try again in'} {retryAfterSeconds}s
                </div>
              </div>
            )}
            {displayError && (
              <div className="error-message">
                <div>{displayError}</div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">{t('testimonialsubdomain.yourName')} *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('testimonialsubdomain.yourName')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">{t('testimonialsubdomain.yourTitle')} *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('testimonialsubdomain.yourTitle')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">{t('testimonialsubdomain.companyOptional')}</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={t('testimonialsubdomain.companyOptional')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating *</label>
              <div className="rating-input">
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value={5}>{t('testimonialsubdomain.fiveStarsExcellent')}</option>
                  <option value={4}>{t('testimonialsubdomain.fourStarsGood')}</option>
                  <option value={3}>{t('testimonialsubdomain.threeStarsFair')}</option>
                  <option value={2}>{t('testimonialsubdomain.twoStarsPoor')}</option>
                  <option value={1}>{t('testimonialsubdomain.oneStarAwful')}</option>
                </select>
                <div className="stars">
                  {[...Array(formData.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('testimonialsubdomain.yourTestimonial')} *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('testimonialsubdomain.yourTestimonial')}
                rows={5}
                required
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                color: charCount > MAX_CHARACTERS ? '#ef4444' : '#cbd5e1'
              }}>
                <span>{t('common.characters') || 'Characters'}: {charCount} / {MAX_CHARACTERS}</span>
                {charCount > MAX_CHARACTERS && (
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                    Exceeds limit by {charCount - MAX_CHARACTERS} characters
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading || retryAfterSeconds > 0 || rateLimitError || !rateLimitFetched} className="submit-btn">
                {!rateLimitFetched ? (
                  i18n.language === 'fr' ? 'Vérification...' : 'Checking...'
                ) : loading ? (
                  t('testimonialsubdomain.submitting') || 'Submitting...'
                ) : retryAfterSeconds > 0 ? (
                  <>
                    {i18n.language === 'fr' ? 'Réessayez dans' : 'Try again in'} {retryAfterSeconds}s
                  </>
                ) : (
                  t('testimonialsubdomain.submitTestimonial')
                )}
              </button>
              {onClose && (
                <button type="button" onClick={onClose} className="cancel-btn">
                  {t('common.cancel')}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
