import { useState } from 'react';
import { projectsAPI } from '../api/projectsAPI';
import '../../../features/admin/pages/AdminDashboard.css';

interface DeleteProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
  deletingId: string | null;
  deletingTitle: string;
}

export const DeleteProjectModal = ({ onClose, onSuccess, deletingId, deletingTitle }: DeleteProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      await projectsAPI.deleteProject(deletingId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Delete Project</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: '#e0e7ff' }}>
            Are you sure you want to delete <strong>"{deletingTitle}"</strong>? This action cannot be undone.
          </p>
          {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="form-btn form-btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className="form-btn form-btn-primary"
            style={{ background: '#ef4444' }}
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
