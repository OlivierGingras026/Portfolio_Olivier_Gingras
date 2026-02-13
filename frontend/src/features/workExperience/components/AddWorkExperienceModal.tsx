import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { workExperienceAPI } from '../api/workExperienceAPI';
import { showToast } from '../../../shared/components/Toast';
import type { CreateWorkExperienceRequest } from '../../../shared/models';
import type { WorkExperience } from '../types';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddWorkExperienceModalProps {
  onClose: () => void;
  onSuccess: (newWork?: WorkExperience) => Promise<void> | void;
}

export const AddWorkExperienceModal = ({ onClose, onSuccess }: AddWorkExperienceModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateWorkExperienceRequest>({
    company: '',
    position: '',
    description: '',
    companyFr: '',
    positionFr: '',
    descriptionFr: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateWorkExperienceRequest, value: unknown) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isCurrent && !formData.endDate) newErrors.endDate = 'End date is required if not current';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        endDate: formData.isCurrent ? undefined : formData.endDate
      };
      const newWork = await workExperienceAPI.createWorkExperience(dataToSend);
      showToast('Work experience added successfully!', 'success');
      await Promise.resolve(onSuccess(newWork));
      onClose();
    } catch (err) {
      console.error('Failed to create work experience:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create work experience';
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
          <span>{t('common.add')} {t('workexperiencesubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Company EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Company name"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              disabled={loading}
            />
            {errors.company && <span className="form-error">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Entreprise FR</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Nom de l\'entreprise"
              value={formData.companyFr || ''}
              onChange={(e) => handleChange('companyFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Position EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Job position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              disabled={loading}
            />
            {errors.position && <span className="form-error">{errors.position}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Poste FR</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Intitulé du poste"
              value={formData.positionFr || ''}
              onChange={(e) => handleChange('positionFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description EN *</label>
            <textarea
              className="form-textarea"
              placeholder="Job description"
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
              placeholder="Description du poste"
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
                checked={formData.isCurrent}
                onChange={(e) => handleChange('isCurrent', e.target.checked)}
                disabled={loading}
              />
              Currently working here
            </label>
          </div>

          {!formData.isCurrent && (
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
