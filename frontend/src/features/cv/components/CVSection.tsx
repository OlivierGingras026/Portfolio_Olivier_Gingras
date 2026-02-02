import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cvAPI, type CVFile } from '../api/cvAPI';
import './CVSection.css';

export const CVSection = () => {
  const { t, i18n } = useTranslation();
  const [cvFile, setCvFile] = useState<CVFile | null>(null);
  const [loading, setLoading] = useState(true);

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
        
          <h2 className="cv-title">{i18n.language === 'fr' ? 'Télécharger Mon' : 'Download My'} <span className="cv-title-highlight">{i18n.language === 'fr' ? 'CV' : 'CV'}</span></h2>
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
            <p className="cv-file-date">{t('cvsubdomain.uploaded')}: {new Date(cvFile.uploadedAt).toLocaleDateString()}</p>
          </div>
          <div className="cv-actions">
            <motion.button
              onClick={handleDownload}
              className="cv-download-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t('cvsubdomain.download')}
            >
              <Download size={20} />
              {t('cvsubdomain.download')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
