import React from 'react';
import { LocaleContentManagerProps, LocaleContent } from '../../types';

const LocaleContentManager: React.FC<LocaleContentManagerProps> = ({ currentLocale, localesContent }) => {
  const content: LocaleContent = localesContent[currentLocale] || {};

  return (
    <div>
      {Object.entries(content).map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return <p key={key}>{key}: {value}</p>;
        }
        
        return (
          <div key={key}>
            <h3>{key}</h3>
            {Object.entries(value as { [key: string]: string | number }).map(([subKey, subValue]) => (
              <p key={subKey}>{subKey}: {subValue}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default LocaleContentManager;
