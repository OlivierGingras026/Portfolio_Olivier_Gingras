import { useState } from 'react';
import { hobbiesAPI } from '../api/hobbiesAPI';
import type { CreateHobbyRequest } from '../../../shared/models';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditHobbyModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editingId: string | null;
  existingData?: Record<string, unknown>;
}

export const EditHobbyModal = ({ onClose, onSuccess, editingId, existingData }: EditHobbyModalProps) => {
  const [formData, setFormData] = useState<CreateHobbyRequest>({
    title: (existingData?.title as string) || '',
    description: (existingData?.description as string) || '',
    imageUrl: (existingData?.imageUrl as string) || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>((existingData?.imageUrl as string) || '');

  const handleChange = (field: keyof CreateHobbyRequest, value: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingId) return;
    
    setLoading(true);
    try {
      await hobbiesAPI.updateHobby(editingId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update hobby:', err);
      setErrors({ submit: 'Failed to update hobby' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Edit Hobby</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Hobby title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={loading}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea 
              className="form-input"
              placeholder="Hobby description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Hobby Image</label>
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
