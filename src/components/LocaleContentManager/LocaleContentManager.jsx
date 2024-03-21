import React from 'react';

const LocaleContentManager = ({ currentLocale, localesContent }) => {
  const content = localesContent[currentLocale] || {};

  return (
    <div>
      {Object.entries(content).map(([key, value]) => {
       
        if (typeof value === 'string' || typeof value === 'number') {
          return <p key={key}>{key}: {value}</p>;
        }
       
        return (
          <div key={key}>
            <h3>{key}</h3>
            {Object.entries(value).map(([subKey, subValue]) => (
              <p key={subKey}>{subKey}: {subValue}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default LocaleContentManager;
