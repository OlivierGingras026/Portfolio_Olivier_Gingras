import { useState } from 'react';
import { testimonialAPI, type TestimonialRequest } from '../api/testimonialAPI';
import './TestimonialSubmitForm.css';
import React from 'react';

interface TestimonialSubmitFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const TestimonialSubmitForm = ({ onSuccess, onClose }: TestimonialSubmitFormProps) => {
  const [formData, setFormData] = useState<TestimonialRequest>({
    name: '',
    title: '',
    company: '',
    rating: 5,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonial-form-container">
      <div className="testimonial-form">
        <div className="form-header">
          <h3>Share Your Feedback</h3>
          <p>Help others by sharing your experience working with me</p>
        </div>

        {success ? (
          <div className="success-message">
            <div className="checkmark">✓</div>
            <h4>Thank You!</h4>
            <p>Your testimonial has been submitted and is pending approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Your Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Project Manager, Developer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company (Optional)</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
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
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
                <div className="stars">
                  {[...Array(formData.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Testimonial *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share your experience and what made working together special..."
                rows={5}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </button>
              {onClose && (
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
