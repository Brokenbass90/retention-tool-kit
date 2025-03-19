import React from 'react';
import './Button.css';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="convert-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
