import React from 'react';
import './ToggleSwitch.css'; 

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  onText?: string;
  offText?: string;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  onText = "",
  offText = "",
  label,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="flex items-center">
      <div className="vc-toggle-container">
        <label className="vc-switch">
          <input
            type="checkbox"
            className="vc-switch-input"
            checked={enabled}
            onChange={handleChange}
            disabled={disabled}
          />
          <span 
            className="vc-switch-label" 
            data-on={onText} 
            data-off={offText}
          />
          <span className="vc-handle" />
        </label>
      </div>
      {label && (
        <span className="ml-3 text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default ToggleSwitch;