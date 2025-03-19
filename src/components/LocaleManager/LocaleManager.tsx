import React from 'react';
import { LocaleManagerProps } from '../../types';

const LocaleManager: React.FC<LocaleManagerProps> = ({ locales, onLocaleSelection }) => {
  return (
    <div className="locale-manager">
      {locales.map(locale => (
        <button key={locale} onClick={() => onLocaleSelection(locale)}>
          {locale}
        </button>
      ))}
    </div>
  );
};

export default LocaleManager;
