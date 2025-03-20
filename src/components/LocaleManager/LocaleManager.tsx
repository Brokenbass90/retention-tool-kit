import React from 'react';
import { observer } from 'mobx-react-lite';
import { appStore } from '../../stores/AppStore';
import { LocaleManagerProps } from '../../types';
import './LocaleManager.css';

const LocaleManager: React.FC<LocaleManagerProps> = observer(({ locales, onLocaleSelection }) => {
  const handleLocaleClick = async (locale: string) => {
    await appStore.handleLocaleSelection(locale);
    onLocaleSelection(locale);
  };

  const handleResetLocale = (locale: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Сбросить локаль ${locale} к оригинальному состоянию?`)) {
      appStore.resetLocaleToOriginal(locale);
    }
  };

  return (
    <div className="locale-manager">
      <button
        className={`locale-btn ${appStore.isOriginalSelected ? 'active' : ''}`}
        onClick={() => onLocaleSelection('')}
      >
        Original
      </button>
      {locales.map((locale) => (
        <div key={locale} className="locale-item">
          <button
            className={`locale-btn ${appStore.selectedLocale === locale ? 'active' : ''}`}
            onClick={() => handleLocaleClick(locale)}
          >
            {locale}
            {appStore.modifiedLocales.has(locale) && (
              <span className="modified-indicator" title="Локаль изменена">
                🔒
              </span>
            )}
          </button>
          {appStore.modifiedLocales.has(locale) && (
            <button
              className="reset-btn"
              onClick={(e) => handleResetLocale(locale, e)}
              title="Вернуть к состоянию нулевой локали"
            >
              🔄
            </button>
          )}
        </div>
      ))}
      {appStore.hasUnsavedChanges && !appStore.isOriginalSelected && (
        <div className="action-buttons">
          <button 
            className="apply-btn"
            onClick={() => appStore.applyChanges()}
            title="Сохранить изменения для текущей локали"
          >
            Применить
          </button>
          <button 
            className="discard-btn"
            onClick={() => appStore.discardChanges()}
            title="Отменить изменения"
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  );
});

export default LocaleManager;
