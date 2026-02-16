import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  // Normalize language to just language code (en, fr) not full locale (en-US)
  const currentLang = i18n.language?.split('-')[0] || 'en';

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      title={t('common.language')}
      aria-label={t('common.language')}
    >
      <Globe size={18} />
      <span className="language-code">
        {currentLang.toUpperCase()}
      </span>
    </button>
  );
}
