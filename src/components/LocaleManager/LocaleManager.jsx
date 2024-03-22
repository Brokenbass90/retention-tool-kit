import React from 'react';


const LocaleManager = ({ locales, onLocaleSelection }) => {
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
