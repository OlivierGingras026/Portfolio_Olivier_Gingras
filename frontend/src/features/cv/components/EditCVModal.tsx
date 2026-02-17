import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cvAPI } from '../api/cvAPI';
import '../../../features/admin/pages/AdminDashboard.css';

interface EditCVModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
  cvId?: string;
}

export const EditCVModal = ({ onClose, onSuccess, cvId }: EditCVModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFrench, setIsFrench] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !cvId) return;

    setLoading(true);
    try {
      if (cvId) {
        // Edit existing CV
        if (selectedFile) {
          await cvAPI.updateCVFile(cvId, selectedFile, isFrench);
        } else {
          await cvAPI.updateCVLanguage(cvId, isFrench);
        }
      } else {
        // Upload new CV
        await cvAPI.uploadCV(selectedFile!, isFrench);
      }
      await Promise.resolve(onSuccess());
      onClose();
    } catch (error: any) {
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
        <h2 className="modal-title">{cvId ? 'Edit CV' : 'Upload CV'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
              {cvId ? 'Select New CV File (optional)' : 'Select CV File'}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              required={!cvId}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#0f172a',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '0.5rem'
              }}
            />
            {selectedFile && (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="isFrench"
              checked={isFrench}
              onChange={(e) => setIsFrench(e.target.checked)}
              style={{
                marginRight: '0.75rem',
                width: '18px',
                height: '18px',
                accentColor: '#3b82f6',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="isFrench" style={{ color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
              French Version
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={(!selectedFile && !cvId) || loading}
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

