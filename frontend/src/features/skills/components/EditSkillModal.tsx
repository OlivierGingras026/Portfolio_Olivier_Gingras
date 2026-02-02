import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skillsAPI } from '../api/skillsAPI';
import type { CreateSkillRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditSkillModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditSkillModal = ({ onClose, onSuccess, editingId, existingData }: EditSkillModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateSkillRequest>({
    title: (existingData?.title as string) || '',
    description: (existingData?.description as string) || '',
    titleFr: (existingData?.titleFr as string) || '',
    descriptionFr: (existingData?.descriptionFr as string) || '',
    type: (existingData?.type as 'frontend' | 'backend' | 'other') || 'other'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateSkillRequest, value: string | ('frontend' | 'backend' | 'other')) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingId) return;
    
    setLoading(true);
    try {
      await skillsAPI.updateSkill(editingId, formData);
      await Promise.resolve(onSuccess());
      onClose();
    } catch (err) {
      console.error('Failed to update skill:', err);
      setErrors({ submit: 'Failed to update skill' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{t('common.edit')} {t('skillsubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title EN *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Skill title"
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
              placeholder="Titre de la compétence"
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
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="other">{t('skillsubdomain.other')}</option>
            </select>
            {errors.type && <span className="form-error">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description EN *</label>
            <textarea 
              className="form-input"
              placeholder="Skill description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description FR</label>
            <textarea 
              className="form-input"
              placeholder="Description de la compétence"
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

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
