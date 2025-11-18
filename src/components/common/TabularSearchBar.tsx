import { motion } from "framer-motion";
import React from "react";

interface SearchBarProps {
  isSearchable?: boolean;
  className?: string;
}

const ServicesSearchBar: React.FC<SearchBarProps> = ({
  isSearchable,
  className,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState("Emp Name");

  const filters = ["Emp Name", "Emp Code", "Bio-Metric"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`w-full ${className}`}
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`flex items-center justify-between gap-2 overflow-clip rounded-lg border-[1.5px] border-slate-300 bg-white transition-all duration-200 ${
          isFocused ? "ring-[1.5px] ring-blue-500" : ""
        }`}
      >
        {/* Search Icon Button */}
        <motion.button
          animate={{
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          type="button"
          className="cursor-pointer h-full rounded-md border-[1.5px] border-slate-300 bg-white p-3.5 transition-all duration-200 ease-in-out hover:bg-slate-300 active:bg-slate-400"
        >
          <img className="w-4" src="/icons/search-icon.svg" alt="search" />
        </motion.button>

        {/* Input field */}
        <input
          type="text"
          placeholder={`Search by ${selectedFilter}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-grow bg-transparent px-4 py-0 text-base font-normal text-slate-500 focus:outline-none"
        />

        {/* Filter buttons (inline) */}
        <div className="flex shrink-0 border border-slate-200 p-1 items-center gap-1 rounded-md">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-[6px] text-sm font-medium cursor-pointer border transition-all duration-150 ${
                selectedFilter === filter
                  ? "bg-blue-500 text-white border-transparent"
                  : "bg-white text-blue-500 border-blue-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServicesSearchBar;
