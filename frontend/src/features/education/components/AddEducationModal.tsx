import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { educationAPI } from '../api/educationAPI';
import type { CreateEducationRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddEducationModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export const AddEducationModal = ({ onClose, onSuccess }: AddEducationModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateEducationRequest>({
    school: '',
    degree: '',
    description: '',
    schoolFr: '',
    degreeFr: '',
    descriptionFr: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateEducationRequest, value: unknown) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.school.trim()) newErrors.school = 'School is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isCurrentlyStudying && !formData.endDate) newErrors.endDate = 'End date is required if not currently studying';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        endDate: formData.isCurrentlyStudying ? undefined : formData.endDate
      };
      await educationAPI.createEducation(dataToSend);
      await Promise.resolve(onSuccess());
      onClose();
    } catch (err) {
      console.error('Failed to create education:', err);
      setErrors({ submit: 'Failed to create education' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{t('common.add')} {t('educationsubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">School EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="School/University name"
              value={formData.school}
              onChange={(e) => handleChange('school', e.target.value)}
              disabled={loading}
            />
            {errors.school && <span className="form-error">{errors.school}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">École FR</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Nom de l'école/université"
              value={formData.schoolFr || ''}
              onChange={(e) => handleChange('schoolFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Degree EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Degree name"
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              disabled={loading}
            />
            {errors.degree && <span className="form-error">{errors.degree}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Diplôme FR</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Nom du diplôme"
              value={formData.degreeFr || ''}
              onChange={(e) => handleChange('degreeFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description EN *</label>
            <textarea
              className="form-textarea"
              placeholder="Education description"
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
              placeholder="Description de l'éducation"
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input 
              type="date"
              className="form-input"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              disabled={loading}
            />
            {errors.startDate && <span className="form-error">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <input 
                type="checkbox"
                checked={formData.isCurrentlyStudying}
                onChange={(e) => handleChange('isCurrentlyStudying', e.target.checked)}
                disabled={loading}
              />
              Currently studying
            </label>
          </div>

          {!formData.isCurrentlyStudying && (
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input 
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                disabled={loading}
              />
              {errors.endDate && <span className="form-error">{errors.endDate}</span>}
            </div>
          )}

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
