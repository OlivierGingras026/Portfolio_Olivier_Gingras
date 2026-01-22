import { useState } from 'react';
import { educationAPI } from '../api/educationAPI';
import type { CreateEducationRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditEducationModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditEducationModal = ({ onClose, onSuccess, editingId, existingData }: EditEducationModalProps) => {
  const [formData, setFormData] = useState<CreateEducationRequest>({
    school: (existingData?.school as string) || '',
    degree: (existingData?.degree as string) || '',
    description: (existingData?.description as string) || '',
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
      await educationAPI.updateEducation(editingId, dataToSend);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update education:', err);
      setErrors({ submit: 'Failed to update education' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Edit Education</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">School *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="School name"
              value={formData.school}
              onChange={(e) => handleChange('school', e.target.value)}
              disabled={loading}
            />
            {errors.school && <span className="form-error">{errors.school}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Degree *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Degree"
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              disabled={loading}
            />
            {errors.degree && <span className="form-error">{errors.degree}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea 
              className="form-input"
              placeholder="Education description"
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
