import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RequestEntrySkeleton = () => {
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md md:mb-0">
      <h2 className="mb-4 text-xl font-semibold">
        <Skeleton width={180} height={24} />
      </h2>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton width={120} height={12} />
            <Skeleton height={44} className="rounded-xl" />
          </div>
        ))}

        {/* Quantity spares block */}
        <div className="col-span-1 mt-4 flex flex-col gap-2 md:col-span-2">
          <Skeleton width={140} height={16} />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
            >
              <Skeleton width={100} height={12} />
              <div className="flex flex-row items-center gap-2">
                <Skeleton width={24} height={24} circle />
                <Skeleton width={64} height={32} />
                <Skeleton width={24} height={24} circle />
              </div>
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div className="col-span-1 md:col-span-2">
          <Skeleton height={150} className="rounded-xl" />
        </div>

        <div className="col-span-1 mt-4 flex justify-end md:col-span-2">
          <Skeleton width={120} height={40} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default RequestEntrySkeleton;
