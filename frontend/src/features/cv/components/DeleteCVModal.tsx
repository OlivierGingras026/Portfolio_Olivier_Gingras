import { useState } from 'react';
import { motion } from 'framer-motion';
import { cvAPI } from '../api/cvAPI';
import '../../../features/admin/pages/AdminDashboard.css';

interface DeleteCVModalProps {
  onClose: () => void;
  onSuccess: () => void;
  fileName: string;
}

export const DeleteCVModal = ({ onClose, onSuccess, fileName }: DeleteCVModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Get the active CV to delete it
      const activeCV = await cvAPI.getActiveCV();
      await cvAPI.deleteCV(activeCV.cvId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete CV:', error);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <h2 className="modal-title">Delete CV</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>{fileName}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#a16565' : '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: '#334155',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
