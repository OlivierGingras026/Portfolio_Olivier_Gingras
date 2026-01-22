import { useState } from 'react';
import { skillsAPI } from '../api/skillsAPI';
import type { CreateSkillRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface AddSkillModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSkillModal = ({ onClose, onSuccess }: AddSkillModalProps) => {
  const [formData, setFormData] = useState<CreateSkillRequest>({
    title: '',
    description: ''
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await skillsAPI.createSkill(formData);
      onSuccess();
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
          <span>Add New Skill</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
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
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Skill description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {errors.submit && <div className="form-error" style={{ marginBottom: '1rem' }}>{errors.submit}</div>}
        </div>

        <div className="form-actions">
          <button className="form-btn form-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button className="form-btn form-btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
