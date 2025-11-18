import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { DropdownOption } from "./DropDown";

interface MultiSelectDropdownProps {
  title?: string;
  options: DropdownOption[];
  selectedOptions: DropdownOption[];
  onChange: (options: DropdownOption[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  direction?: "down" | "up" | "left" | "right";
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  disabled = false,
  title,
  options,
  selectedOptions,
  onChange,
  placeholder = "Select items to add",
  required = false,
  className = "",
  direction = "down",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen to form submission attempt to shake only on submit
  useEffect(() => {
    const inputId = `multi-dropdown-hidden-${title?.replace(/\s/g, "")}`;
    const input = document.getElementById(inputId);

    const handleInvalid = (event: Event) => {
      event.preventDefault();
      setWasSubmitted(true);
      setShake(true);
      dropdownRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => setShake(false), 400);
    };

    input?.addEventListener("invalid", handleInvalid);
    return () => {
      input?.removeEventListener("invalid", handleInvalid);
    };
  }, [selectedOptions.length, required, title]);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption) => {
    const isAlreadySelected = selectedOptions.some(
      (selected) => selected.id === option.id,
    );

    if (!isAlreadySelected) {
      const newSelection = [...selectedOptions, option];
      onChange(newSelection);
      setWasSubmitted(false); // reset on change
    }
    setIsOpen(false);
  };

  const handleRemoveChip = (optionToRemove: DropdownOption) => {
    const newSelection = selectedOptions.filter(
      (option) => option.id !== optionToRemove.id,
    );
    onChange(newSelection);
  };

  const getDirectionClass = () => {
    switch (direction) {
      case "up":
        return "bottom-full mb-2";
      case "left":
        return "right-full mr-2 top-0";
      case "right":
        return "left-full ml-2 top-0";
      case "down":
      default:
        return "top-full mt-2";
    }
  };

  const isInvalid = required && selectedOptions.length === 0 && wasSubmitted;

  // Filter out already selected options
  const availableOptions = options.filter(
    (option) => !selectedOptions.some((selected) => selected.id === option.id),
  );

  return (
    <div className={`${className} w-full`}>
      {title && (
        <h3 className="mb-0.5 text-xs leading-loose font-semibold text-slate-700">
          {title}
          {required && <span className="text-red-500">*</span>}
        </h3>
      )}

      {/* Display selected chips */}
      {selectedOptions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600"
            >
              <span>{option.label}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(option)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                disabled={disabled}
              >
                <img
                  className="max-h-3 max-w-3"
                  src="/icons/chip-x-icon.svg"
                  alt="x"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={`relative disabled:cursor-not-allowed`} ref={dropdownRef}>
        {/* Hidden input triggers native validation */}
        <input
          id={`multi-dropdown-hidden-${title?.replace(/\s/g, "")}`}
          type="text"
          required={required}
          value={selectedOptions.length > 0 ? "valid" : ""}
          onChange={() => {}}
          disabled={disabled}
          className="hidden disabled:cursor-not-allowed"
          tabIndex={-1}
        />

        <motion.div
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={toggleDropdown}
          animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`input-container flex items-center justify-between rounded-xl border-2 bg-white px-3 py-3 transition-all ${
            disabled
              ? "pointer-events-none cursor-not-allowed opacity-60"
              : "cursor-pointer"
          } ${isInvalid ? "border-red-500" : isOpen ? "border-slate-500" : "border-slate-300"}`}
        >
          <span className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-slate-700">
            {placeholder}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.div>
        </motion.div>

        {isOpen && availableOptions.length > 0 && (
          <div
            className={`absolute z-10 max-h-[200px] w-full overflow-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm ${getDirectionClass()}`}
          >
            {availableOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left hover:bg-slate-100"
              >
                <span className="text-sm text-slate-700">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {isOpen && availableOptions.length === 0 && (
          <div
            className={`absolute z-10 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm ${getDirectionClass()}`}
          >
            <span className="text-sm text-slate-400">
              No more options available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
