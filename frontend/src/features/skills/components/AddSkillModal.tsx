import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skillsAPI } from '../api/skillsAPI';
import { showToast } from '../../../shared/components/Toast';
import type { CreateSkillRequest } from '../../../shared/models';
import type { Skill } from '../types';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddSkillModalProps {
  onClose: () => void;
  onSuccess: (newSkill?: Skill) => Promise<void> | void;
}

export const AddSkillModal = ({ onClose, onSuccess }: AddSkillModalProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<CreateSkillRequest>({
    title: '',
    description: '',
    titleFr: '',
    descriptionFr: '',
    type: 'other'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateSkillRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = t('common.error');
    if (!formData.description.trim()) newErrors.description = t('common.error');
    if (!formData.type) newErrors.type = t('common.error');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const newSkill = await skillsAPI.createSkill(formData);
      showToast(t('toasts.skillCreated'), 'success');
      await Promise.resolve(onSuccess(newSkill));
      onClose();
    } catch (err) {
      console.error('Failed to create skill:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create skill';
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
          <span>{t('skillsubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Titre EN *' : 'Title EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? 'Titre de la compétence' : 'Skill title'}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={loading}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Titre FR' : 'Title FR'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? 'Titre de la compétence' : 'Skill title'}
              value={formData.titleFr || ''}
              onChange={(e) => handleChange('titleFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('skillsubdomain.type')} *</label>
            <select 
              className="form-input"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as 'frontend' | 'backend' | 'other')}
              disabled={loading}
            >
              <option value="frontend">{t('skillsubdomain.frontend')}</option>
              <option value="backend">{t('skillsubdomain.backend')}</option>
              <option value="other">{t('skillsubdomain.other')}</option>
            </select>
            {errors.type && <span className="form-error">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description EN *' : 'Description EN *'}</label>
            <textarea
              className="form-textarea"
              placeholder={i18n.language === 'fr' ? 'Description de la compétence' : 'Skill description'}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description FR' : 'Description FR'}</label>
            <textarea
              className="form-textarea"
              placeholder={i18n.language === 'fr' ? 'Description de la compétence' : 'Skill description'}
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
            />
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
