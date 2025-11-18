import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface DropdownOption {
  label: string;
  id: number;
}

interface DropdownSelectProps {
  title?: string;
  options: DropdownOption[];
  selected: DropdownOption;
  onChange: (option: DropdownOption) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  direction?: "down" | "up" | "left" | "right";
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  disabled = false,
  title,
  options,
  selected,
  onChange,
  required = false,
  className = "",
  direction = "down",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add CSS for webkit scrollbars
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .dropdown-scrollbar::-webkit-scrollbar {
        width: 8px;
        position: absolute;
        right: 0;
      }
      .dropdown-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .dropdown-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      .dropdown-scrollbar::-webkit-scrollbar-button {
        display: none;
      }
      .dropdown-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // 🔥 Listen to form submission attempt to shake only on submit
  useEffect(() => {
    // Fixed: Removed extra space in template literal
    const inputId = `dropdown-hidden-${title?.replace(/\s/g, "")}`;
    const input = document.getElementById(inputId);

    const handleInvalid = (event: Event) => {
      event.preventDefault();
      setWasSubmitted(true);
      setShake(true);
      // Scroll to the actual visible dropdown container instead of hidden input
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
  }, [selected.id, required, title]);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
    setWasSubmitted(false); // reset on change
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

  const isInvalid = required && (selected?.id ?? 0) === 0 && wasSubmitted;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`relative ${className} select-none disabled:cursor-not-allowed`}
      ref={dropdownRef}
    >
      {title && (
        <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
          {title}
          {required && <span className="text-red-500">*</span>}
        </h3>
      )}

      {/* Fixed: Removed extra space in id template literal */}
      <input
        id={`dropdown-hidden-${title?.replace(/\s/g, "")}`}
        type="text"
        required={required}
        value={selected.id === 0 ? "" : selected.id}
        onChange={() => {}}
        disabled={disabled}
        className="hidden select-none disabled:cursor-not-allowed"
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
        } ${isInvalid ? "border-red-500" : isOpen ? "scale-3d scale-[102%] border-slate-500 transition-all duration-200 ease-in-out" : "border-slate-300"}`}
      >
        <span className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-slate-600">
          {selected.label}
        </span>

        <img
          src="/icons/dropdown.svg"
          alt="Dropdown icon"
          className="h-4 w-4"
        />
      </motion.div>

      {isOpen && (
        <div
          className={`dropdown-scrollbar absolute z-99 max-h-[200px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm ${getDirectionClass()}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option)}
              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 hover:bg-slate-100 ${
                selected.label === option.label
                  ? "font-semibold text-blue-600"
                  : "text-slate-700"
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DropdownSelect;
