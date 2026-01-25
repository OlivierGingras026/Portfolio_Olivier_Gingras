import { X } from 'lucide-react';
import './CVPreviewModal.css';

interface CVPreviewModalProps {
  fileName: string;
  fileData: string;
  onClose: () => void;
}

export const CVPreviewModal = ({ fileName, fileData, onClose }: CVPreviewModalProps) => {
  return (
    <div className="cv-preview-overlay" onClick={onClose}>
      <div className="cv-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-preview-header">
          <h3>{fileName}</h3>
          <button onClick={onClose} className="cv-preview-close">
            <X size={24} />
          </button>
        </div>
        <div className="cv-preview-content">
          <iframe
            src={`data:application/pdf;base64,${fileData}`}
            className="cv-preview-iframe"
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
};
