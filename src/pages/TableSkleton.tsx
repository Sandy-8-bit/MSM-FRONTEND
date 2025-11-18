import { motion } from "framer-motion";
import React from "react";

const shimmer = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.2,
      repeat: Infinity,
    },
  },
};

const ShimmerBox = ({ className }: { className: string }) => (
  <motion.div
    className={`relative overflow-hidden rounded bg-gray-200 ${className}`}
    variants={shimmer}
    initial="initial"
    animate="animate"
  >
    <motion.div
      className="absolute top-0 left-[-50%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{ left: ["-50%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

const EmployeeTableSkeleton = () => {
  return (
    <div className="rounded-[12px] bg-white/80 p-4">
      <div className="mb-2 flex items-center justify-between">
        <section className="result-length flex flex-row items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-blue-500"></div>
          <ShimmerBox className="h-4 w-[200px]" />
        </section>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <ShimmerBox key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>

      <div className="tables mt-4 flex min-h-[300px] w-full flex-col overflow-clip rounded-[9px] bg-white shadow-sm">
        <header className="header flex w-full flex-row items-center gap-2 bg-gray-100 px-3 py-3">
          {[
            "60px",
            "120px",
            "160px",
            "120px",
            "140px",
            "160px",
            "160px",
            "120px",
            "100px",
            "120px",
            "120px",
          ].map((width, i) => (
            <div
              key={i}
              className={`h-4 rounded bg-gray-300`}
              style={{ width }}
            ></div>
          ))}
        </header>

        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className={`flex w-full items-center gap-2 px-3 py-2 ${
              idx % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
          >
            <ShimmerBox className="h-4 w-[60px]" />
            <ShimmerBox className="h-4 w-[120px]" />
            <ShimmerBox className="h-4 w-[160px]" />
            <ShimmerBox className="h-4 w-[120px]" />
            <ShimmerBox className="h-4 w-[140px]" />
            <ShimmerBox className="h-4 w-[160px]" />
            <ShimmerBox className="h-4 w-[160px]" />
            <ShimmerBox className="h-4 w-[120px]" />
            <ShimmerBox className="h-4 w-[100px]" />
            <ShimmerBox className="h-4 w-[120px]" />
            <div className="flex min-w-[120px] flex-row gap-2">
              <ShimmerBox className="h-8 w-8 rounded" />
              <ShimmerBox className="h-8 w-8 rounded" />
              <ShimmerBox className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTableSkeleton;
