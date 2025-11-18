import React, { useState } from "react";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import { useFetchModelsOptions } from "../../queries/masterQueries/ProductQuery";
import { useFetchServiceEngineerOptions } from "../../queries/masterQueries/ServiceEngineersQuery";
import { useFetchProblemOptions } from "../../queries/masterQueries/Problem-types";
import DropdownSelect from "@/components/common/DropDown";
import { DateInput } from "../../components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import ButtonSm from "@/components/common/Buttons";
import { useGenerateReportPDF } from "@/queries/reportsQuery";

interface Filters {
  clientName: string;
  model: string;
  serviceDate: string;
  technician: string;
  complaint: string;
  status: string;
  refDateFrom: string;
  refDateTo: string;
}

const CustomerReport: React.FC = () => {
  const initialFilters: Filters = {
    clientName: "",
    model: "",
    serviceDate: "",
    technician: "",
    complaint: "",
    status: "",
    refDateFrom: "",
    refDateTo: "",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const { mutate: generateReport, isPending } = useGenerateReportPDF();
  const { data: brandOptions = [] } = useFetchModelsOptions();
  const { data: serviceOptions = [] } = useFetchServiceEngineerOptions();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: problemOptions = [] } = useFetchProblemOptions();

  // Determine if any filter is active
  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  // Clear all filters
  const handleClearAll = () => {
    setFilters(initialFilters);
  };

  // Clear individual filter
  const handleClearFilter = (filterKey: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [filterKey]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.nativeEvent as SubmitEvent;
    const submitter = form.submitter as HTMLButtonElement;
    const isViewOnly = submitter?.value === "view";
    generateReport({
      params: {
        clientName: filters.clientName || undefined,
        model: filters.model || undefined,
        serviceDate: filters.serviceDate || undefined,
        technician: filters.technician || undefined,
        complaint: filters.complaint || undefined,
        status: filters.status || undefined,
      },
      isViewOnly,
    });
  };

  const getDefaultOption = (label: string) => ({
    id: 0,
    label: label,
  });

  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 rounded-xl bg-white/80 p-6">
      <PageHeader title="Customer Report" />

      <form onSubmit={handleSubmit} className="">
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">
              Filter Options
            </h2>
            {/* Show "Clear All" only if any filter is active */}
            {hasActiveFilters && (
              <ButtonSm
                state="default"
                name="action"
                value="clear"
                disabled={isPending}
                type="button"
                text="Clear All"
                onClick={handleClearAll}
                className="border-1 border-red-500 bg-red-100 text-red-500 hover:bg-red-200 active:bg-red-200"
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DropdownSelect
              title="Client"
              options={clientOptions}
              selected={
                clientOptions.find((c) => c.label === filters.clientName) ||
                getDefaultOption("Select Client")
              }
              onChange={(val) =>
                setFilters({ ...filters, clientName: val.label })
              }
            />

            <DropdownSelect
              title="Model"
              options={brandOptions}
              selected={
                brandOptions.find((b) => b.label === filters.model) ||
                getDefaultOption("Select Model")
              }
              onChange={(val) => setFilters({ ...filters, model: val.label })}
            />

            <DateInput
              title="Service Date"
              value={filters.serviceDate}
              onChange={(val) => setFilters({ ...filters, serviceDate: val })}
              name="serviceDate"
            />

            <DropdownSelect
              title="Technician"
              options={serviceOptions}
              selected={
                serviceOptions.find((s) => s.label === filters.technician) ||
                getDefaultOption("Select Technician")
              }
              onChange={(val) =>
                setFilters({ ...filters, technician: val.label })
              }
            />

            <DropdownSelect
              title="Complaint"
              options={problemOptions}
              selected={
                problemOptions.find((p) => p.label === filters.complaint) ||
                getDefaultOption("Select Complaint")
              }
              onChange={(val) =>
                setFilters({ ...filters, complaint: val.label })
              }
            />

            <DropdownSelect
              title="Status"
              options={[
                { id: 1, label: "Completed" },
                { id: 2, label: "Not Completed" },
              ]}
              selected={
                [
                  { id: 1, label: "Completed" },
                  { id: 2, label: "Not Completed" },
                ].find((p) => p.label === filters.status) ||
                getDefaultOption("Select Status")
              }
              onChange={(val) => setFilters({ ...filters, status: val.label })}
            />
          </div>

          {/* Show active filters as chips */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              <span className="mt-1 text-sm font-medium text-gray-700">
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <div
                    key={key}
                    onClick={() => handleClearFilter(key as keyof Filters)}
                    className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    <span>
                      <strong>{label}:</strong> {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleClearFilter(key as keyof Filters)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <ButtonSm
              state="default"
              name="action"
              value="view"
              type="submit"
              text="Submit"
              disabled={isPending}
              className="mt-auto flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0] active:bg-[#2a5bb0]"
            />
            <ButtonSm
              state="default"
              name="action"
              value="download"
              disabled={isPending}
              type="submit"
              text="PDF"
              className="mt-auto flex min-w-[60px] cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-3 text-center text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0] active:bg-[#2a5bb0]"
            />
            <ButtonSm
              state="default"
              name="action"
              value="download"
              disabled={isPending}
              type="button"
              text="EXCEL"
              className="mt-auto flex min-w-[60px] cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-3 text-center text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0] active:bg-[#2a5bb0]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerReport;
