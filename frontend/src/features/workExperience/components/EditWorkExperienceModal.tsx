import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { workExperienceAPI } from '../api/workExperienceAPI';
import { showToast } from '../../../shared/components/Toast';
import type { CreateWorkExperienceRequest } from '../../../shared/models';import type { WorkExperience } from '../types';import '../../../features/admin/pages/AdminDashboard.css';

interface EditWorkExperienceModalProps {
  onClose: () => void;
  onSuccess: (updatedWork?: WorkExperience) => Promise<void> | void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditWorkExperienceModal = ({ onClose, onSuccess, editingId, existingData }: EditWorkExperienceModalProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<CreateWorkExperienceRequest>({
    company: (existingData?.company as string) || '',
    position: (existingData?.position as string) || '',
    description: (existingData?.description as string) || '',
    companyFr: (existingData?.companyFr as string) || '',
    positionFr: (existingData?.positionFr as string) || '',
    descriptionFr: (existingData?.descriptionFr as string) || '',
    startDate: (existingData?.startDate as string) || '',
    endDate: (existingData?.endDate as string) || '',
    isCurrent: (existingData?.isCurrent as boolean) || false
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingId) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        endDate: formData.isCurrent ? undefined : formData.endDate
      };
      const updatedWork = await workExperienceAPI.updateWorkExperience(editingId, dataToSend);
      showToast(t('toasts.workUpdated'), 'success');
      await Promise.resolve(onSuccess(updatedWork));
      onClose();
    } catch (err) {
      console.error('Failed to update work experience:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update work experience';
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
          <span>{t('common.edit')} {t('workexperiencesubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Entreprise EN *' : 'Company EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Nom de l'entreprise" : "Company name"}
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              disabled={loading}
            />
            {errors.company && <span className="form-error">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Entreprise FR' : 'Company FR'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Nom de l'entreprise"
              value={formData.companyFr || ''}
              onChange={(e) => handleChange('companyFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Poste EN *' : 'Position EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Intitulé du poste" : "Job title"}
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              disabled={loading}
            />
            {errors.position && <span className="form-error">{errors.position}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Poste FR' : 'Position FR'}</label>
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
            <label className="form-label">{i18n.language === 'fr' ? 'Description EN *' : 'Description EN *'}</label>
            <textarea 
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Description du poste" : "Job description"}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description FR' : 'Description FR'}</label>
            <textarea 
              className="form-input"
              placeholder="Description du poste"
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
              rows={4}
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
              {' '}Currently working here
            </label>
          </div>

          {!formData.isCurrent && (
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input 
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {errors.submit && (
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{errors.submit}</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="form-btn form-btn-secondary" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </button>
          <button 
            className="form-btn form-btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};
