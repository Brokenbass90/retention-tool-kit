import React from 'react';

const LocaleManager = ({ locales, onLocaleChange }) => {
  return (
    <div className="locale-manager">
      {locales.map(locale => (
        <button key={locale} onClick={() => onLocaleChange(locale)}>
          {locale}
        </button>
      ))}
    </div>
  );
};

export default LocaleManager;
