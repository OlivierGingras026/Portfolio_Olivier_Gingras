import { useState } from 'react';
import { motion } from 'framer-motion';
import { cvAPI } from '../api/cvAPI';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditCVModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export const EditCVModal = ({ onClose, onSuccess }: EditCVModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      await cvAPI.uploadCV(selectedFile);
      await Promise.resolve(onSuccess());
      onClose();
    } catch (error) {
      console.error('Failed to update CV:', error);
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
        <h2 className="modal-title">Edit CV</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Select New CV File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '0.5rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: (selectedFile && !loading) ? '#22c55e' : '#64748b',
                color: (selectedFile && !loading) ? '#000' : '#94a3b8',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: (selectedFile && !loading) ? 'pointer' : 'not-allowed',
                fontWeight: '600'
              }}
            >
              {loading ? 'Updating...' : 'Update CV'}
            </button>
            <button
              type="button"
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
        </form>
      </motion.div>
    </div>
  );
};

