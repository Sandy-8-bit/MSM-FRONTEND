import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";

import { useState } from "react";
import { useFetchEntry } from "@/queries/TranscationQueries/ServiceEntryQuery";
import { DeleteEntryDialogBox } from "./ServiceEntryDelete.Dialog"; // <- your dialog file
import type { ServiceEntryData } from "@/types/transactionTypes";
import ServiceEntryDisplay from "./ServiceEntry.view";
import { appRoutes } from "@/routes/appRoutes";
import { useNavigate } from "react-router-dom";
import type { DataCell } from "@/components/common/GenericTable";
import GenericTable from "@/components/common/GenericTable";

const ServiceEntryPage = () => {
  const navigate = useNavigate();

  const [selectedEntry, setSelectedEntry] = useState<ServiceEntryData | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);

  const { data, isLoading } = useFetchEntry(1, 100000);

  const paginatedData = data?.data || [];

  const dataCell: DataCell[] = [
    {
      headingTitle: "Ref No",
      accessVar: "refNumber",
      searchable: true,
      sortable: true,
      className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
    },
    {
      headingTitle: "Service Date",
      accessVar: "serviceDate",
      searchable: true,
      sortable: true,
      className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
    },
    {
      headingTitle: "Client",
      accessVar: "clientName",
      searchable: true,
      sortable: true,
      className: "w-32 min-w-32 px-2 md:w-40 md:min-w-40",
    },
    {
      headingTitle: "Maintenance Type",
      accessVar: "maintenanceType",
      searchable: true,
      sortable: true,
      className: "w-32 min-w-32 px-2 md:w-36 md:min-w-36",
    },
    {
      headingTitle: "Engineer Name",
      accessVar: "engineerName",
      searchable: true,
      sortable: true,
      className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
    },
    {
      headingTitle: "Diagnostics",
      accessVar: "engineerDiagnostics",
      searchable: true,
      sortable: true,
      className: "w-30 min-w-30 px-2 md:w-37 md:min-w-37",
    },
    {
      headingTitle: "Status",
      accessVar: "serviceStatus",
      searchable: true,
      sortable: true,
      className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
      render(value, row, index) {
        return (
          <div
            key={value + index}
            className="w-24 min-w-24 px-2 md:w-28 md:min-w-28"
          >
            <span
              className={`inline-flex min-w-full items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                row.serviceStatus === "Completed" ||
                row.serviceStatus === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : row.serviceStatus === "NOT_COMPLETED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {row.serviceStatus === "COMPLETED"
                ? "Completed"
                : row.serviceStatus === "NOT_COMPLETED"
                  ? "Not Completed"
                  : "Pending"}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mb-32 flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg bg-white p-3">
        <div className="flex flex-col">
          <PageHeader title={"Service Entry"} />
          <p className="text-sm font-medium text-slate-500">
            Manage your Service Entry
          </p>
        </div>
        <ButtonSm
          className="font-medium text-white"
          text={"New Entry"}
          state="default"
          type="button"
          onClick={() => {
            navigate(appRoutes.transactionRoutes.children.serviceEntryNew);
          }}
          iconPosition="right"
          imgUrl="/icons/plus-icon.svg"
        />
      </div>
      {/* Table */}
      <GenericTable
        data={paginatedData}
        dataCell={dataCell}
        isLoading={isLoading}
        enableSelection
        onView={(row) => {
          setSelectedEntry(row);
          setIsViewFormOpen(true);
        }}
        onDelete={(row) => {
          setSelectedEntry(row);
          setIsDeleteDialogOpen(true);
        }}
      />

      <AnimatePresence>
        {isDeleteDialogOpen && selectedEntry && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteEntryDialogBox
              Entry={selectedEntry}
              setIsDeleteMachineDialogOpen={setIsDeleteDialogOpen}
              onDeleted={() => {
                setSelectedEntry(null);
              }}
            />
          </DialogBox>
        )}
        {isViewFormOpen && selectedEntry && (
          <DialogBox
            className="min-w-[800px]"
            setToggleDialogueBox={setIsViewFormOpen}
          >
            <ServiceEntryDisplay
              data={selectedEntry}
              setIsDialogOpen={setIsViewFormOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceEntryPage;
