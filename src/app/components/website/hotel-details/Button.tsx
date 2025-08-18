import React from 'react';

interface ButtonProps {
  label: string;
  style?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, style = '', onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${style}`}
    >
      {label}
    </button>
  );
};

export default Button;