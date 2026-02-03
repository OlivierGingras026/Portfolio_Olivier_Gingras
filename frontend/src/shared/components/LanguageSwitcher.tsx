import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
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
        {i18n.language.toUpperCase()}
      </span>
    </button>
  );
}
