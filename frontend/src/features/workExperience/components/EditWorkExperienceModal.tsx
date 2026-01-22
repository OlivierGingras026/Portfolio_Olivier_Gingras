import { useState } from 'react';
import { workExperienceAPI } from '../api/workExperienceAPI';
import type { CreateWorkExperienceRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditWorkExperienceModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditWorkExperienceModal = ({ onClose, onSuccess, editingId, existingData }: EditWorkExperienceModalProps) => {
  const [formData, setFormData] = useState<CreateWorkExperienceRequest>({
    company: (existingData?.company as string) || '',
    position: (existingData?.position as string) || '',
    description: (existingData?.description as string) || '',
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
      await workExperienceAPI.updateWorkExperience(editingId, dataToSend);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update work experience:', err);
      setErrors({ submit: 'Failed to update work experience' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Edit Work Experience</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Company *</label>
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
            <label className="form-label">Position *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Job title"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              disabled={loading}
            />
            {errors.position && <span className="form-error">{errors.position}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea 
              className="form-input"
              placeholder="Job description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
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
            Cancel
          </button>
          <button 
            className="form-btn form-btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};
