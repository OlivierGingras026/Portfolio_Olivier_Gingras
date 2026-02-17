import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { skillsAPI } from '../api/skillsAPI';
import { showToast } from '../../../shared/components/Toast';
import '../../../features/admin/pages/AdminDashboard.css';

interface DeleteSkillModalProps {
  onClose: () => void;
  onSuccess: (deletedId?: string) => Promise<void> | void;
  deletingId: string | null;
  deletingTitle: string;
}

export const DeleteSkillModal = ({ onClose, onSuccess, deletingId, deletingTitle }: DeleteSkillModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    
    setLoading(true);
    try {
      await skillsAPI.deleteSkill(deletingId);
      showToast(t('toasts.skillDeleted'), 'success');
      await Promise.resolve(onSuccess(deletingId));
      onClose();
    } catch (err) {
      console.error('Failed to delete skill:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete skill';
      showToast(errorMsg, 'error');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Delete Skill</span>
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
