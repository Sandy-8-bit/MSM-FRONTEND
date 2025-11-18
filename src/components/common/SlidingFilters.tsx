import { motion } from "framer-motion";
import React from "react";

interface FilterOnlyBarProps {
  filters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

const FilterOnlyBar: React.FC<FilterOnlyBarProps> = ({
  filters,
  selectedFilter,
  onFilterChange,
  className = "",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = React.useState({ width: 0, left: 0 });

  React.useEffect(() => {
    const updateSliderPosition = () => {
      const selectedIndex = filters.indexOf(selectedFilter);
      const selectedButton = buttonRefs.current[selectedIndex];
      const container = containerRef.current;

      if (selectedButton && container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = selectedButton.getBoundingClientRect();

        setSliderStyle({
          width: buttonRect.width,
          left: buttonRect.left - containerRect.left,
        });
      }
    };

    updateSliderPosition();
    window.addEventListener("resize", updateSliderPosition);
    return () => window.removeEventListener("resize", updateSliderPosition);
  }, [selectedFilter, filters]);

  return (
    <div className={`flex items-center px-2 py-1 ${className}`}>
      <div ref={containerRef} className="relative flex rounded-lg bg-slate-100">
        {/* Background slider */}
        <motion.div
          animate={{
            width: sliderStyle.width,
            x: sliderStyle.left,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute top-1 bottom-1 rounded-md bg-blue-500 shadow-sm"
        />

        {/* Filter buttons */}
        {filters.map((filter, index) => (
          <motion.button
            key={index}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => onFilterChange(filter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`relative z-10 cursor-pointer rounded-md px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedFilter === filter
                ? "text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="relative z-10">{filter}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FilterOnlyBar;
