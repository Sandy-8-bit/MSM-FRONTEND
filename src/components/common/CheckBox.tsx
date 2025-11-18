import React from "react";

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  name = "",
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-2"
      onClick={handleClick}
    >
      {/* Hidden native checkbox for accessibility */}
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={() => {}}
        className="hidden"
      />
      {/* Custom checkbox box */}
      <div
        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
          checked ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"
        } transition-all duration-200`}
      >
        {checked && (
          <img
            src="/icons/tick-icon.svg"
            alt="tick"
            className="h-[12px] w-[12px]"
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <label htmlFor={name} className="text-sm text-slate-700 select-none">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
    </div>
  );
};

export default CheckboxInput;
