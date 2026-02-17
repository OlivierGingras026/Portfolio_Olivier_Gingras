import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hobbiesAPI } from '../api/hobbiesAPI';
import { showToast } from '../../../shared/components/Toast';
import type { CreateHobbyRequest } from '../../../shared/models';
import type { Hobby } from '../types';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddHobbyModalProps {
  onClose: () => void;
  onSuccess: (newHobby?: Hobby) => Promise<void> | void;
}

export const AddHobbyModal = ({ onClose, onSuccess }: AddHobbyModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateHobbyRequest>({
    title: '',
    description: '',
    titleFr: '',
    descriptionFr: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleChange = (field: keyof CreateHobbyRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, imageUrl: result });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const newHobby = await hobbiesAPI.createHobby(formData);
      showToast(t('toasts.hobbyAdded'), 'success');
      await Promise.resolve(onSuccess(newHobby));
      onClose();
    } catch (err) {
      console.error('Failed to create hobby:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create hobby';
      showToast(errorMsg, 'error');
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{t('common.add')} {t('hobbysubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Hobby title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={loading}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Titre FR</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Titre du hobby"
              value={formData.titleFr || ''}
              onChange={(e) => handleChange('titleFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description EN *</label>
            <textarea
              className="form-textarea"
              placeholder="Hobby description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description FR</label>
            <textarea
              className="form-textarea"
              placeholder="Description du hobby"
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hobby Image</label>
            <input 
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageUpload}
              disabled={loading}
            />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem', maxWidth: '200px' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
              </div>
            )}
          </div>

          {errors.submit && <div className="form-error" style={{ marginBottom: '1rem' }}>{errors.submit}</div>}
        </div>

        <div className="form-actions">
          <button className="form-btn form-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t('common.loading') : t('common.save')}
          </button>
          <button className="form-btn form-btn-secondary" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
