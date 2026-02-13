import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { educationAPI } from '../api/educationAPI';
import { showToast } from '../../../shared/components/Toast';
import type { CreateEducationRequest } from '../../../shared/models';import type { Education } from '../types';import '../../../features/admin/pages/AdminDashboard.css';

interface EditEducationModalProps {
  onClose: () => void;
  onSuccess: (updatedEducation?: Education) => Promise<void> | void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditEducationModal = ({ onClose, onSuccess, editingId, existingData }: EditEducationModalProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<CreateEducationRequest>({
    school: (existingData?.school as string) || '',
    degree: (existingData?.degree as string) || '',
    description: (existingData?.description as string) || '',
    schoolFr: (existingData?.schoolFr as string) || '',
    degreeFr: (existingData?.degreeFr as string) || '',
    descriptionFr: (existingData?.descriptionFr as string) || '',
    startDate: (existingData?.startDate as string) || '',
    endDate: (existingData?.endDate as string) || '',
    isCurrentlyStudying: (existingData?.isCurrentlyStudying as boolean) || false
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingId) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        endDate: formData.isCurrentlyStudying ? undefined : formData.endDate
      };
      const updatedEducation = await educationAPI.updateEducation(editingId, dataToSend);
      showToast('Education updated successfully!', 'success');
      await Promise.resolve(onSuccess(updatedEducation));
      onClose();
    } catch (err) {
      console.error('Failed to update education:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update education';
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
          <span>{t('common.edit')} {t('educationsubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'École EN *' : 'School EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Nom de l'école" : "School name"}
              value={formData.school}
              onChange={(e) => handleChange('school', e.target.value)}
              disabled={loading}
            />
            {errors.school && <span className="form-error">{errors.school}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'École FR' : 'School FR'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Nom de l'école"
              value={formData.schoolFr || ''}
              onChange={(e) => handleChange('schoolFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Diplôme EN *' : 'Degree EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Diplôme" : "Degree"}
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              disabled={loading}
            />
            {errors.degree && <span className="form-error">{errors.degree}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Diplôme FR' : 'Degree FR'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Diplôme"
              value={formData.degreeFr || ''}
              onChange={(e) => handleChange('degreeFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description EN *' : 'Description EN *'}</label>
            <textarea 
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Description de la formation" : "Education description"}
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
              placeholder="Description de l'éducation"
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
                checked={formData.isCurrentlyStudying}
                onChange={(e) => handleChange('isCurrentlyStudying', e.target.checked)}
                disabled={loading}
              />
              {' '}Currently studying
            </label>
          </div>

          {!formData.isCurrentlyStudying && (
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
