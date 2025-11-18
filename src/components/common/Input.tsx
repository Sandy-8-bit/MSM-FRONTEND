import { motion } from "motion/react";
import React from "react";

type InputType = "str" | "num";

/**
 * Generic Input component for handling both string and number values.
 * Can be used in reusable forms with strict type control and validation.
 *
 * @template T - Input value type (string | number)
 */
interface InputProps<T extends string | number> {
  /** Label title above the input field */
  title: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Current input value */
  inputValue: T;
  /**
   * Callback triggered on value change
   * @param value - New value of input
   */
  onChange: (value: T) => void;
  /** Input type - "str" for text, "num" for number */
  type?: InputType;
  /** Optional input `name` attribute */
  name?: string;
  /** Prefix label shown before the input (e.g., ₹ or +91) */
  prefixText?: string;
  /** Maximum character length (applies to string input only) */
  maxLength?: number;
  /** Minimum numeric value allowed (for type="num") */
  min?: number;
  /** Maximum numeric value allowed (for type="num") */
  max?: number;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  viewMode?: boolean;
  className?: string;
}

/**
 * Reusable Input component with strict typing and smart constraints.
 * Supports both text and number fields, with prefix, length limits, and min/max validation.
 *
 * @example
 * ```tsx
 * <Input
 *   title="Phone Number"
 *   inputValue={phone}
 *   onChange={(val) => setPhone(val)}
 *   type="num"
 *   prefixText="+91"
 *   max={9999999999}
 * />
 * ```
 */
const Input = <T extends string | number>({
  required = false,
  title,
  placeholder = "",
  inputValue,
  onChange,
  type = "str",
  name = "",
  prefixText = "",
  maxLength = 36,
  min,
  max,
  className = "",
  disabled = false,
  minLength = 0,
  viewMode = false, //depriciate dont-use
}: InputProps<T>) => {
  const inputType = type === "num" ? "number" : "text";

  /**
   * Handles input changes with type-aware validation.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (type === "num") {
      if (raw === "") {
        onChange("" as T); // allow browser to validate required
        return;
      }

      const num = Number(raw);
      if (!isNaN(num)) {
        if (
          (min !== undefined && num < min) ||
          (max !== undefined && num > max)
        )
          return;
        onChange(num as T);
      }
    } else {
      // just pass the raw string directly
      onChange(raw as T);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative w-full min-w-[180px] self-stretch"
    >
      <h3
        className={`mb-0.5 w-full justify-start ${viewMode ? "text-base font-medium text-slate-600" : "text-xs leading-loose font-semibold text-slate-700"}`}
      >
        {title} {required && <span className="text-red-500"> *</span>}
      </h3>
      <div
        className={`input-container flex cursor-text flex-row items-center justify-center gap-0 overflow-clip rounded-xl ${viewMode ? "" : "border-2 border-slate-300 bg-white transition-all focus-within:border-slate-500"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {prefixText && (
          <div className="flex h-full items-center justify-start bg-slate-100 px-3 py-2 text-sm leading-loose font-medium text-slate-700">
            {prefixText}
          </div>
        )}
        <input
          required={required}
          readOnly={disabled}
          disabled={disabled}
          type={inputType}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          value={inputValue}
          className={`custom-disabled-cursor min-h-max w-full ${
            disabled ? "bg-slate-200" : "cursor-text"
          } ${className} text-start ${viewMode ? "text-base font-medium text-slate-900" : "px-3 py-3 text-sm font-medium text-slate-600 autofill:text-black focus:outline-none"} read-only:cursor-default read-only:bg-white`}
          maxLength={type === "str" ? maxLength : undefined}
          min={type === "num" ? min : undefined}
          max={type === "num" ? max : undefined}
          minLength={type === "str" ? minLength : undefined}
        />
      </div>
    </motion.div>
  );
};

export default Input;

interface InputCheckboxProps {
  title: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Checkbox component styled like the main Input component.
 * Label on the left, checkbox on the right inside bordered container.
 */
export const InputCheckbox: React.FC<InputCheckboxProps> = ({
  title,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="relative w-full min-w-[180px] self-stretch">
      <div
        className={`input-container flex flex-row items-center justify-between rounded-xl border-2 border-slate-300 bg-white px-4 py-2 transition-all duration-200 ease-in-out`}
      >
        <span className="text-sm font-medium text-slate-600">{title}</span>

        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={`checkbox-${title}`}
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label
            htmlFor={`checkbox-${title}`}
            className={`relative block h-5 w-5 ${disabled ? "cursor-default" : "cursor-pointer"} rounded-[8px] border-2 p-[12px] transition-all outline-none focus:outline-none ${
              checked
                ? "border-green-500 bg-green-500"
                : "border-slate-300 bg-white"
            }`}
          >
            {checked && (
              <img
                className="pointer-events-none absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
                src="/icons/tick-icon.svg"
                alt="tick"
              />
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

interface TimeInputProps {
  title: string;
  value: string;
  onChange: (val: string) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  title,
  value,
  onChange,
  name = "",
  placeholder = "Select time",
  required = false,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative w-full min-w-[180px] self-stretch"
    >
      <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
        {title}
      </h3>

      <div
        className={`input-container group flex cursor-pointer flex-row items-center justify-between gap-2 overflow-clip rounded-xl border-2 border-slate-300 bg-white transition-all ${
          !disabled && "focus-within:border-slate-500"
        }`}
      >
        <input
          required={required}
          disabled={disabled}
          readOnly={disabled}
          type="time"
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          style={{
            zoom: 1, // ⬅️ makes entire input including clock icon bigger
            WebkitAppearance: "textfield",
            cursor: "pointer",
          }}
          className="min-h-max w-full cursor-pointer px-3 py-3 text-start text-sm font-medium text-slate-600 autofill:text-black focus:outline-none"
        />
      </div>
    </motion.div>
  );
};

interface DateInputProps {
  title: string;
  value: string;
  onChange: (val: string) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  title,
  value,
  onChange,
  name = "",
  className = "",
  placeholder = "Select date",
  required = false,
  disabled = false,
  minDate,
  maxDate,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`relative w-full min-w-[180px] self-stretch ${className}`}
    >
      <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
        {title} {required && <span className="text-red-500"> *</span>}
      </h3>

      <div
        className={`input-container group flex cursor-pointer flex-row items-center justify-between gap-2 overflow-clip rounded-xl border-2 border-slate-300 bg-white transition-all ${
          !disabled && "focus-within:border-slate-500"
        }`}
      >
        <input
          required={required}
          disabled={disabled}
          readOnly={disabled}
          type="date"
          name={name}
          min={minDate}
          max={maxDate}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          style={{
            zoom: 1,
            WebkitAppearance: "textfield",
            cursor: "pointer",
          }}
          className="min-h-max w-full cursor-pointer px-3 py-3 text-start text-sm font-medium text-slate-600 autofill:text-black focus:outline-none"
        />
      </div>
    </motion.div>
  );
};

import { useState, useEffect, useRef } from "react";

interface Suggestion {
  id: string;
  title: string;
}

interface AutoSuggestInputProps {
  title: string;
  fetchSuggestions: (query: string) => Promise<Suggestion[]>;
  onSelect: (item: Suggestion) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  title,
  fetchSuggestions,
  onSelect,
  placeholder = "Search...",
  required = false,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue.length > 1) {
      fetchSuggestions(debouncedValue).then(setSuggestions);
      setIsVisible(true);
    } else {
      setSuggestions([]);
      setIsVisible(false);
    }
  }, [debouncedValue, fetchSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsVisible(false);
    }
  };

  const handleSelect = (item: Suggestion) => {
    setInputValue(item.title);
    onSelect(item);
    setSuggestions([]);
    setIsVisible(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full min-w-[180px] self-stretch">
      <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
        {title} {required && <span className="text-red-500">*</span>}
      </h3>

      <div
        className={`input-container group flex flex-row items-center justify-between overflow-clip rounded-xl border-2 bg-white transition-all ${
          disabled
            ? "cursor-default bg-slate-200"
            : "cursor-text border-slate-300 focus-within:border-slate-500"
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          readOnly={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="min-h-max w-full px-3 py-3 text-start text-sm font-medium text-slate-600 autofill:text-black focus:outline-none"
        />
      </div>

      {isVisible && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-300 bg-white shadow-md"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                index === selectedIndex ? "bg-purple-200" : "hover:bg-gray-100"
              }`}
            >
              <div>
                <div className="text-sm font-medium">{item.title}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
