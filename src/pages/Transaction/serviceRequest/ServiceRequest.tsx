import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import type { FormState } from "@/types/appTypes";
import DropdownSelect from "@/components/common/DropDown";
import type { ServiceRequest } from "@/types/transactionTypes";
import { useEffect, useState } from "react";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";
import ServiceRequestFormPage from "./ServiceForm";
import { DeleteServiceRequestDialogBox } from "./ServiceRequestDelete.Dialog";
import { AssignEngineerDialogBox } from "./AssignEnginnerDialog";
import { useSearchParams } from "react-router-dom";
import type { DataCell } from "@/components/common/GenericTable";
import GenericTable from "@/components/common/GenericTable";
import { Edit2Icon } from "lucide-react";

const ServiceRequestPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");
  const [searchParams] = useSearchParams();
  const statusFromURL = searchParams.get("status") || "";
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    setSelectedFilter(statusFromURL);
  }, [statusFromURL]);

  const { data, isLoading, refetch } = useFetchServiceRequests(
    1,
    10000,
    selectedFilter,
  );

  const isStatusCompleted = (status: string) => {
    return status === "Completed" || status === "COMPLETED";
  };

  useEffect(() => {
    if (selectedFilter) {
      refetch();
    }
  }, [selectedFilter]);

  const paginatedData = data?.data || [];

  const dummyRequestData: ServiceRequest = {
    id: 0,
    referenceNumber: "",
    requestDate: new Date().toISOString().split("T")[0],
    complaintDetails: "",
    clientName: "",
    engineerName: "Not assigned",
    machineType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
  };

  const dataCell: DataCell[] = [
    {
      headingTitle: "Ref No",
      accessVar: "referenceNumber",
      searchable: true,
      sortable: true,
      className: "w-20 min-w-20 px-2 md:w-24 md:min-w-24",
    },
    {
      headingTitle: "Request Date",
      accessVar: "requestDate",
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
      headingTitle: "Machine Type",
      accessVar: "machineType",
      searchable: true,
      sortable: true,
      className: "w-28 min-w-28 px-2 md:w-32 md:min-w-32",
    },
    {
      headingTitle: "Brand",
      accessVar: "brand",
      searchable: true,
      sortable: true,
      className: "w-16 min-w-16 px-2 md:w-20 md:min-w-20",
    },
    {
      headingTitle: "Model No",
      accessVar: "modelNumber",
      searchable: true,
      sortable: true,
      className: "w-20 min-w-20 px-2 md:w-24 md:min-w-24",
    },
    {
      headingTitle: "Complaint",
      accessVar: "complaintDetails",
      searchable: true,
      sortable: false, // probably too big for sorting?
      className: "w-28 min-w-28 px-2 md:w-36 md:min-w-36",
    },
    {
      headingTitle: "Assign",
      accessVar: "engineerName", // in your code it’s engineerName / assign button
      searchable: true,
      sortable: true,
      className: "w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28",
      render(value, row, index) {
        return (
          <div key={index} className="w-24 min-w-24 md:w-28 md:min-w-28">
            {isStatusCompleted(row?.status || "") ? (
              <div className="flex min-w-full scale-90 items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2">
                <span className="text-sm font-medium text-gray-500">
                  {row.engineerName || "Completed"}
                </span>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFormState("edit");
                  setIsFormOpen(true);
                  setSelectedRequest(row);
                }}
                className="flex w-24 min-w-24 scale-90 cursor-pointer flex-row items-center justify-center gap-2 rounded-md border border-blue-600 bg-blue-100 px-3 py-2 md:w-28 md:min-w-28"
              >
                <Edit2Icon className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">
                  {row.engineerName || "Completed"}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      headingTitle: "Status",
      accessVar: "status",
      searchable: true,
      sortable: true,
      className: "w-20 min-w-24 px-2 md:w-24 md:min-w-24",
      render(value, row, index) {
        return (
          <div key={index} className="w-20 min-w-24 md:w-24 md:min-w-24">
            <span
              className={`inline-flex min-w-full items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                row.status === "Completed" || row.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : row.status === "NOT_COMPLETED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {row.status === "COMPLETED"
                ? "Completed"
                : row.status === "NOT_COMPLETED"
                  ? "Unfinished"
                  : "Pending"}
            </span>
          </div>
        );
      },
    },
    // ⚠️ Action column is skipped here since you already render it manually
  ];

  return (
    <div className="mb-32 flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg bg-white p-3">
        <div className="flex flex-col">
          <PageHeader title="Service Requests" />
          <p className="text-sm font-medium text-slate-500">
            Manage your Service Requests
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <ButtonSm
            className="font-medium text-white"
            text={"New Request"}
            state="default"
            type="button"
            onClick={() => {
              setSelectedRequest(dummyRequestData);
              setFormState("create");
              setIsFormOpen(true);
            }}
            iconPosition="right"
            imgUrl="/icons/plus-icon.svg"
          />
        </div>
      </div>

      <GenericTable
        data={paginatedData}
        dataCell={dataCell}
        isLoading={isLoading}
        onDelete={(row) => {
          setSelectedRequest(row);
          setIsDeleteDialogOpen(true);
        }}
        children={
          <DropdownSelect
            className="min-w-[200px]"
            options={[
              { id: 0, label: "All" },
              { id: 1, label: "Completed" },
              { id: 2, label: "Not Completed" },
              { id: 3, label: "Pending" },
            ]}
            selected={{
              id: 0,
              label: selectedFilter || "All",
            }}
            onChange={(val) => setSelectedFilter(val.label)}
          />
        }
      />

      <AnimatePresence>
        {isDeleteDialogOpen && selectedRequest && (
          <DialogBox
            setToggleDialogueBox={setIsDeleteDialogOpen}
            className="lg:max-w-[450px]"
          >
            <DeleteServiceRequestDialogBox
              request={selectedRequest}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              onDeleted={() => {
                setSelectedRequest(null);
              }}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && selectedRequest && formState === "create" && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[800px]"
          >
            <ServiceRequestFormPage
              mode={formState}
              requestFromParent={selectedRequest}
              setFormVisible={setIsFormOpen}
            />
          </DialogBox>
        )}
        {isFormOpen && selectedRequest && formState === "edit" && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[350px]"
          >
            <AssignEngineerDialogBox
              setIsAssignDialogOpen={setIsFormOpen}
              serviceRequestData={selectedRequest}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceRequestPage;
