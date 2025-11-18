import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  error?: Error;
  onRefresh: () => void;
};

export const ErrorPageContent: React.FC<Props> = ({ error, onRefresh }) => {
  const navigate = useNavigate();
  const isDev = import.meta.env.MODE === "development";

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <section className="self-center bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl dark:text-blue-500">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can't find that page. You'll find lots to explore on the
              home page.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-900"
              >
                Back to Homepage
              </button>
              <button
                onClick={onRefresh}
                className="cursor-pointer rounded-lg bg-slate-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-300 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-700"
              >
                Refresh Page
              </button>
            </div>

            {isDev && error && (
              <pre className="mt-6 rounded bg-red-100 p-4 text-left text-sm break-words whitespace-pre-wrap text-red-600 dark:bg-red-900 dark:text-red-300">
                {error.message}
              </pre>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
