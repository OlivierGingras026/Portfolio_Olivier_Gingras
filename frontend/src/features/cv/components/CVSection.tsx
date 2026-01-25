import { useEffect, useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cvAPI, type CVFile } from '../api/cvAPI';
import { CVPreviewModal } from './CVPreviewModal';
import './CVSection.css';

export const CVSection = () => {
  const [cvFile, setCvFile] = useState<CVFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<string>('');

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const cv = await cvAPI.getActiveCV();
        setCvFile(cv);
      } catch (error) {
        console.error('Failed to fetch CV:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  const handleDownload = async () => {
    if (cvFile) {
      try {
        await cvAPI.downloadCV(cvFile.cvId);
      } catch (error) {
        console.error('Failed to download CV:', error);
      }
    }
  };

  const handlePreview = async () => {
    if (cvFile) {
      try {
        const response = await fetch(`/api/v1/cv/download/${cvFile.cvId}`);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          setPreviewData(base64Data);
          setShowPreview(true);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to preview CV:', error);
      }
    }
  };

  if (loading || !cvFile) return null;

  return (
    <section id="cv" className="cv-section">
      <div className="cv-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="cv-header"
        >
        
          <h2 className="cv-title">Download My <span className="cv-title-highlight">CV</span></h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="cv-card"
          whileHover={{ y: -8 }}
        >
          <div className="cv-icon">
            <Download size={32} />
          </div>
          <div className="cv-content">
            <h3 className="cv-file-name">{cvFile.fileName}</h3>
            <p className="cv-file-size">{(cvFile.fileSize / 1024).toFixed(2)} KB</p>
            <p className="cv-file-date">Uploaded: {new Date(cvFile.uploadedAt).toLocaleDateString()}</p>
          </div>
          <div className="cv-actions">
            <motion.button
              onClick={handlePreview}
              className="cv-preview-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Preview CV"
            >
              <Eye size={20} />
              Preview
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="cv-download-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download CV"
            >
              <Download size={20} />
              Download
            </motion.button>
          </div>
        </motion.div>

        {showPreview && (
          <CVPreviewModal
            fileName={cvFile.fileName}
            fileData={previewData}
            onClose={() => {
              setShowPreview(false);
              setPreviewData('');
            }}
          />
        )}
      </div>
    </section>
  );
};
