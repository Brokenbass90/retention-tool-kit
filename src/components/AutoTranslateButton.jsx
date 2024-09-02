import React from 'react';
import { appStore } from '../stores/AppStore';
import Button from './Button/Button'; 

const AutoTranslateButton = () => {
  const handleClick = () => {
    appStore.autoFillLocales();
  };

  return (
    <Button onClick={handleClick}>
      Auto Translate and Fill Locales
    </Button>
  );
};

export default AutoTranslateButton;
