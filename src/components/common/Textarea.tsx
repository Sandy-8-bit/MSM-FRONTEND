import React from "react";

interface TextAreaProps {
  title: string;
  placeholder?: string;
  inputValue: string;
  onChange: (value: string) => void;
  name?: string;
  prefixText?: string;
  className?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  minLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  title,
  placeholder = "",
  className = "",
  inputValue,
  onChange,
  minLength = 10,
  name = "",
  prefixText = "",
  maxLength = 100,
  disabled = false,
  required = false,
}) => {
  const [count, setCount] = React.useState<string>(
    (inputValue ?? "").length.toString(),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (disabled) return; // optional hard stop
    if (value.length <= maxLength) {
      onChange(value);
      setCount(value.length.toString());
    }
  };

  return (
    <div className={`relative w-full min-w-[180px] self-stretch ${className}`}>
      <div className="flex max-h-full min-w-full flex-row items-center justify-between">
        <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
          {title}
        </h3>
        <h3 className="mb-0.5 justify-start text-xs leading-loose font-semibold text-slate-700">
          {count}/{maxLength}
        </h3>
      </div>

      <div
        className={`input-container flex max-h-full flex-row items-center justify-center gap-0 overflow-clip rounded-xl border-2 bg-white transition-all ${
          disabled
            ? "cursor-not-allowed border-slate-300 bg-slate-200 opacity-60"
            : "cursor-text border-slate-300 focus-within:border-slate-500"
        }`}
      >
        {prefixText && (
          <div className="flex h-full items-center justify-start bg-slate-100 px-3 py-2 text-sm leading-loose font-medium text-slate-700">
            {prefixText}
          </div>
        )}

        <textarea
          required={required}
          readOnly={disabled}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          value={inputValue}
          maxLength={maxLength}
          minLength={minLength}
          className={`max-h-full min-h-max w-full resize-none px-4 py-[14px] text-start text-sm font-medium text-slate-600 autofill:text-black focus:outline-none ${
            disabled ? "bg-white-200 cursor-not-allowed" : "cursor-text"
          }`}
          rows={4}
        />
      </div>
    </div>
  );
};

export default TextArea;
