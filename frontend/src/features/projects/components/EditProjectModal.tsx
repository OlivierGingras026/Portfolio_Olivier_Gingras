import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { projectsAPI } from '../api/projectsAPI';
import type { CreateProjectRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditProjectModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditProjectModal = ({ onClose, onSuccess, editingId, existingData }: EditProjectModalProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<CreateProjectRequest & { technologies?: string[] }>({
    title: (existingData?.title as string) || '',
    description: (existingData?.description as string) || '',
    titleFr: (existingData?.titleFr as string) || '',
    descriptionFr: (existingData?.descriptionFr as string) || '',
    url: (existingData?.url as string) || '',
    imageUrl: (existingData?.imageUrl as string) || '',
    technologies: (existingData?.technologies as string[]) || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>((existingData?.imageUrl as string) || '');
  const [techInput, setTechInput] = useState<string>('');

  const handleChange = (field: keyof (CreateProjectRequest & { technologies?: string[] }), value: string | string[]) => {
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

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter((_, i) => i !== index)
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.url.trim()) newErrors.url = 'Project URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingId) return;
    
    setLoading(true);
    try {
      await projectsAPI.updateProject(editingId, formData);
      await Promise.resolve(onSuccess());
      onClose();
    } catch (err) {
      console.error('Failed to update project:', err);
      setErrors({ submit: 'Failed to update project' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{t('common.edit')} {t('projectsubdomain.title')}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Titre EN *' : 'Title EN *'}</label>
            <input 
              type="text"
              className="form-input"
              placeholder={i18n.language === 'fr' ? "Titre du projet" : "Project title"}
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
              placeholder={i18n.language === 'fr' ? "Titre du projet" : "Titre du projet"}
              value={formData.titleFr || ''}
              onChange={(e) => handleChange('titleFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{i18n.language === 'fr' ? 'Description EN *' : 'Description EN *'}</label>
            <textarea
              className="form-textarea"
              placeholder={i18n.language === 'fr' ? "Description du projet" : "Project description"}
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
              placeholder={i18n.language === 'fr' ? "Description du projet" : "Description du projet"}
              value={formData.descriptionFr || ''}
              onChange={(e) => handleChange('descriptionFr', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.url')} *</label>
            <input 
              type="url"
              className="form-input"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              disabled={loading}
            />
            {errors.url && <span className="form-error">{errors.url}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.imageUrl')}</label>
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

          <div className="form-group">
            <label className="form-label">{t('admin.technologies')}</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. React, TypeScript, Node.js"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button 
                type="button"
                className="form-btn form-btn-secondary"
                onClick={handleAddTechnology}
                disabled={loading || !techInput.trim()}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('common.add')}
              </button>
            </div>
            {formData.technologies && formData.technologies.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.technologies.map((tech, idx) => (
                  <span 
                    key={idx}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgb(59, 130, 246)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(idx)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
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
