import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const shimmer = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const StaffProfileSkeleton = () => {
  return (
    <main className="staff-profile-container mx-auto flex w-full max-w-[1390px] flex-col gap-0">
      <div className="my-4 flex flex-col gap-6 rounded-xl bg-white p-1">
        <section className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col gap-2">
              <Skeleton height={20} width={120} />
              <Skeleton height={18} width={100} />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Skeleton height={40} width={120} />
            <Skeleton height={40} width={120} />
          </div>
        </section>
      </div>

      <div className="flex flex-row items-center gap-6 px-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height={32} width={100} />
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 shadow-sm">
        <section className="grid grid-cols-3 gap-4">
          {[...Array(24)].map((_, i) => (
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              key={i}
              className="w-full"
            >
              <Skeleton height={48} className="rounded-md" />
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default StaffProfileSkeleton;

export const StaffProfileSkeleton2 = () => {
  return (
    <section className="flex w-full flex-row items-center justify-between gap-4">
      <div className="profile-details flex flex-row items-center gap-2">
        {/* Profile image */}
        <Skeleton className="min-h-12 min-w-12 rounded-full" />

        {/* Name and Designation */}
        <div className="dets flex flex-col gap-1">
          <Skeleton className="min-h-5 min-w-32 rounded-md" /> {/* name */}
          <Skeleton className="ml-1 min-h-4 min-w-24 rounded-md" />{" "}
          {/* designation */}
        </div>
      </div>
    </section>
  );
};

export const TabButtonSkeleton: React.FC = () => {
  return (
    <div className="flex flex-row gap-3">
      <Skeleton width={120} height={40} />
      <Skeleton width={120} height={40} />
      <Skeleton width={120} height={40} />
      <Skeleton width={120} height={40} />
    </div>
  );
};
