import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skillsAPI } from '../api/skillsAPI';
import type { CreateSkillRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddSkillModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
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
      await skillsAPI.createSkill(formData);
      await Promise.resolve(onSuccess());
      onClose();
    } catch (err) {
      console.error('Failed to create skill:', err);
      setErrors({ submit: 'Failed to create skill' });
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
            <label className="form-label">{i18n.language === 'fr' ? 'Titre FR *' : 'Title EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? 'Titre de la compétence' : 'Skill title'}
              value={i18n.language === 'fr' ? (formData.titleFr || '') : formData.title}
              onChange={(e) => handleChange(i18n.language === 'fr' ? 'titleFr' : 'title', e.target.value)}
              disabled={loading}
            />
            {errors[i18n.language === 'fr' ? 'titleFr' : 'title'] && <span className="form-error">{errors[i18n.language === 'fr' ? 'titleFr' : 'title']}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('skillsubdomain.type')} *</label>
            <select 
              className="form-input"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as 'frontend' | 'backend' | 'other')}
              disabled={loading}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="other">{t('skillsubdomain.other')}</option>
            </select>
            {errors.type && <span className="form-error">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description FR *' : 'Description EN *'}</label>
            <textarea
              className="form-textarea"
              placeholder={i18n.language === 'fr' ? 'Description de la compétence' : 'Skill description'}
              value={i18n.language === 'fr' ? (formData.descriptionFr || '') : formData.description}
              onChange={(e) => handleChange(i18n.language === 'fr' ? 'descriptionFr' : 'description', e.target.value)}
              disabled={loading}
            />
            {errors[i18n.language === 'fr' ? 'descriptionFr' : 'description'] && <span className="form-error">{errors[i18n.language === 'fr' ? 'descriptionFr' : 'description']}</span>}
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
