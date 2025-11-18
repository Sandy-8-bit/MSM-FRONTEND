import { motion } from "framer-motion";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

// New Skeleton Component for table data area only
export const MasterTableSkeleton = () => {
  return (
    <div className="flex flex-col">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`flex w-full flex-row items-center gap-2 px-3 py-2 ${
            index % 2 === 0 ? "bg-white" : "bg-slate-50"
          }`}
        >
          <div className="w-max min-w-[50px] px-2 py-4 md:min-w-[100px]">
            <div className="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="w-full">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="w-full">
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="flex min-w-[120px] flex-row gap-2">
            <div className="h-8 w-12 animate-pulse rounded bg-gray-300"></div>
            <div className="h-8 w-14 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasterTableSkeleton;

export const InputSkeleton = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      className="flex min-w-full flex-col gap-4 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]"
    >
      <SkeletonBox className="h-6 w-1/2" />

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <SkeletonBox className="h-4 w-1/3" />
          <SkeletonBox className="h-10 w-full" />
        </div>
      ))}

      {/* Simulate checkbox list */}
      <SkeletonBox className="mt-4 h-6 w-1/2" />
      <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <SkeletonBox className="h-4 w-[30px]" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-5 w-5 rounded-md" />
          </div>
        ))}
      </div>
    </motion.section>
  );
};
