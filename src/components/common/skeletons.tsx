export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-80 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200"></div>
                  <div className="h-12 w-16 animate-pulse rounded-xl bg-gray-200"></div>
                </div>
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-1 w-12 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const ServiceRequestSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-36 animate-pulse rounded bg-gray-200"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-32">
                    <div className="h-10 animate-pulse rounded-xl bg-gray-200"></div>
                    <div className="h-10 animate-pulse rounded-xl bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
