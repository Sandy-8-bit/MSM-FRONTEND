import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
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
import SlidingFilters from "@/components/common/SlidingFilters";
import { useSearchParams } from "react-router-dom";

const ServiceRequestPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");

  // const { isSm } = useBreakpoints()
  //
  const [searchParams] = useSearchParams();
  const statusFromURL = searchParams.get("status") || "";
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    setSelectedFilter(statusFromURL);
  }, [statusFromURL]);

  const { data, isLoading, refetch } = useFetchServiceRequests(
    currentPage,
    itemsPerPage,
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
  const totalPages = data?.totalPages || 0;

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

      <div>
        {isLoading ? (
          <EmployeeTableSkeleton />
        ) : (
          <div className="flex flex-col items-start justify-start gap-2 overflow-clip rounded-[12px] bg-white/80 py-3 md:p-4">
            <div className="flex w-full items-center justify-between px-3 md:px-0">
              <section className="result-length flex w-full flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center flex w-full ml-4 md:ml-0 justify-start gap-2">
                  <div className="flex h-[10px] w-[10px]  rounded-full bg-blue-500"></div>
                  <h2 className="text-md min-w-max  font-semibold text-zinc-800">
                    Showing {paginatedData.length} results of{" "}
                    {data?.totalRecords || 0}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* <SlidingFilters
                    filters={["Completed", "Not Completed", "Pending"]}
                    selectedFilter={selectedFilter}
                    onFilterChange={(val) => {
                      setSelectedFilter(val);
                    }}
                  /> */}
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
                  <PaginationControls
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </section>
            </div>

            <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto bg-white shadow-sm md:overflow-x-auto md:rounded-[9px]">
              {/* Header */}
              <header className="header flex min-w-max flex-row items-center justify-between bg-slate-200 px-3 py-3 md:min-w-max">
                {/* S.No + Checkbox */}
                <div className="flex w-16 min-w-16 items-center justify-start gap-2">
                  <p className="w-full text-sm font-semibold text-zinc-900">
                    S.No
                  </p>
                </div>

                {/* Column Headers with responsive widths */}
                <div className="w-20 min-w-20 px-2 md:w-24 md:min-w-24">
                  <p className="text-sm font-semibold text-zinc-900">Ref No</p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-zinc-900">
                    Request Date
                  </p>
                </div>
                <div className="w-32 min-w-32 px-2 md:w-40 md:min-w-40">
                  <p className="text-sm font-semibold text-zinc-900">Client</p>
                </div>
                <div className="w-28 min-w-28 px-2 md:w-32 md:min-w-32">
                  <p className="text-sm font-semibold text-zinc-900">
                    Machine Type
                  </p>
                </div>
                <div className="w-16 min-w-16 px-2 md:w-20 md:min-w-20">
                  <p className="text-sm font-semibold text-zinc-900">Brand</p>
                </div>
                <div className="w-20 min-w-20 px-2 md:w-24 md:min-w-24">
                  <p className="text-sm font-semibold text-zinc-900">
                    Model No
                  </p>
                </div>
                <div className="w-28 min-w-28 px-2 md:w-36 md:min-w-36">
                  <p className="text-sm font-semibold text-zinc-900">
                    Complaint
                  </p>
                </div>
                <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-zinc-900">Assign</p>
                </div>
                <div className="w-20 min-w-24 px-2 md:w-24 md:min-w-24">
                  <p className="text-sm font-semibold text-zinc-900">Status</p>
                </div>

                {/* Action Header */}
                <div className="flex w-12 min-w-12 items-center justify-start gap-2 pt-1">
                  <p className="text-sm font-semibold text-zinc-900">Action</p>
                </div>
              </header>

              {/* No data message */}
              {paginatedData.length === 0 ? (
                <h2 className="text-md my-auto text-center font-medium text-zinc-600">
                  No Entries Found
                </h2>
              ) : (
                paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex min-w-max flex-row items-center justify-between border-t px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50 md:min-w-max"
                  >
                    {/* S.No + Checkbox */}
                    <div className="flex w-16 min-w-16 items-center justify-start gap-2 pt-1">
                      <p className="w-full">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </p>
                    </div>

                    {/* Data Columns with responsive widths */}
                    <div className="w-20 min-w-20 px-2 pt-1 md:w-24 md:min-w-24">
                      <p className="leading-5 break-words">
                        {item.referenceNumber}
                      </p>
                    </div>
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.requestDate}
                      </p>
                    </div>
                    <div className="w-32 min-w-32 px-2 pt-1 md:w-40 md:min-w-40">
                      <p className="leading-5 break-words">{item.clientName}</p>
                    </div>
                    <div className="w-28 min-w-28 px-2 pt-1 md:w-32 md:min-w-32">
                      <p className="leading-5 break-words">
                        {item.machineType}
                      </p>
                    </div>
                    <div className="w-16 min-w-16 px-2 pt-1 md:w-20 md:min-w-20">
                      <p className="leading-5 break-words">{item.brand}</p>
                    </div>
                    <div className="w-20 min-w-20 px-2 md:w-24 md:min-w-24">
                      <p className="leading-5 break-words">
                        {item.modelNumber}
                      </p>
                    </div>
                    <div className="w-28 min-w-28 px-2 md:w-36 md:min-w-36">
                      <p className="leading-5 break-words">
                        {item.complaintDetails}
                      </p>
                    </div>
                  <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                       {isStatusCompleted(item?.status || "") ? (
  <div className="min-w-full scale-90 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2">
    <span className="text-xs font-medium text-gray-500">
      {item.engineerName || "Completed"}
    </span>
  </div>
) : (
  <ButtonSm
    className="min-w-full scale-90 border-1 border-blue-500 bg-blue-500/10"
    onClick={(e) => {
      e.stopPropagation();
      setFormState("edit");
      setIsFormOpen(true);
      setSelectedRequest(item);
    }}
    text={item.engineerName || "Assign"}
    imgUrl={
      item.engineerName
        ? "/icons/edit-icon.svg"
        : "/icons/add-user-icon.svg"
    }
    state="outline"
  />
)}

                      </div>
                    <div className="w-20 min-w-24 px-2 md:w-24 md:min-w-24">
                      <span
                        className={`inline-flex min-w-full items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.status === "Completed" ||
                          item.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : item.status === "NOT_COMPLETED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "COMPLETED"
                          ? "Completed"
                          : item.status === "NOT_COMPLETED"
                            ? "Unfinsished"
                            : "Pending"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-12 min-w-12 items-center justify-start gap-2 pt-1">
                      <ButtonSm
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(item);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="aspect-square scale-90 border-1 border-red-500 bg-red-100 text-red-500 hover:bg-red-100 active:bg-red-100"
                        state="default"
                        imgUrl="/icons/delete-icon.svg"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="flex w-full flex-row items-center justify-between px-3 md:px-0">
              <DropdownSelect
                title=""
                direction="up"
                options={[5, 10, 15, 20].map((item) => ({
                  id: item,
                  label: item.toString(),
                }))}
                selected={{
                  id: itemsPerPage,
                  label: itemsPerPage.toString() + " items Per Page",
                }}
                onChange={(e) => {
                  setItemsPerPage(e.id);
                  setCurrentPage(1);
                }}
              />
            </footer>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteDialogOpen && selectedRequest && (
          <DialogBox
            setToggleDialogueBox={setIsDeleteDialogOpen}
            className="p-3 lg:min-w-[400px]"
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
