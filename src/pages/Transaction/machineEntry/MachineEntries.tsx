import {
  useCreateMachineQR,
  useFetchMachine,
} from "../../../queries/TranscationQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import { DeleteMachineDialogBox } from "./MachineEntryDelete.Dialog";
import { useState } from "react";
import type { MachineDetails } from "@/types/transactionTypes";
import MachineFormPage from "./MachineForm";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import CheckboxInput from "@/components/common/CheckBox";
import type { FormState } from "@/types/appTypes";
import { convertToFrontendDate } from "@/utils/commonUtils";
import DropdownSelect from "@/components/common/DropDown";
import { useBreakpoints } from "@/hooks/useBreakPoints";
import MachineImportModal from "./MachineImportModal";
import SearchBarWithFilter from "@/components/common/SearchBarWIthFilters";

export interface MachineEntrySearchParam {
  status: string;
  requestDateFrom: string;
  requestDateTo: string;
  clientName: string;
  machineType: string;
  brand: string;
}

const MachineEntry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteMachineDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { isSm } = useBreakpoints();

  // Search and filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("client-name");

  const { data, isLoading, refetch } = useFetchMachine(
    currentPage,
    itemsPerPage,
    activeFilter === "client-name" ? searchValue : undefined,
    activeFilter === "machine-type" ? searchValue : undefined,
    activeFilter === "brand" ? searchValue : undefined,
  );

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchValue(""); // Reset search when filter changes (optional)
  };

  const { mutate: generateQR, isPending: isCreateQRPending } =
    useCreateMachineQR();

  const paginatedData = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const allIdsOnPage = paginatedData.map((m) => m.id);
  const isAllSelected = allIdsOnPage.every((id) => selectedIds.includes(id));

  const handleSelectAllChange = () => {
    setSelectedIds((prev) =>
      isAllSelected
        ? prev.filter((id) => !allIdsOnPage.includes(id))
        : [...new Set([...prev, ...allIdsOnPage])],
    );
  };

  const dummyMachineData: MachineDetails = {
    id: 0,
    slNo: "",
    serialNumber: "",
    referenceNumber: "",
    installationDate: convertToFrontendDate(
      new Date().toISOString().split("T")[0],
    ),
    installedByEngineerName: "",
    remarks: "",
    machinePhotos: [],
    clientName: "",
    machineType: "",
    brand: "",
    productId: 0,
    modelNumber: "",
  };

  return (
    <div className="mb-32 flex flex-col gap-4">
      {/* Header */}
      <header className="flex flex-col items-center justify-between gap-4 rounded-lg bg-white/80 p-3">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex w-full flex-col items-start">
            <PageHeader title="Machine Entry" />
            <p className="text-sm font-medium text-slate-500">
              Manage your Machine Entries
            </p>
          </div>
          <div className="flex w-full flex-row items-end justify-end gap-2">
            <ButtonSm
              disabled={selectedIds.length === 0 || isCreateQRPending}
              className={`${
                selectedIds.length > 0 ? "text-white" : "disabled:opacity-60"
              } min-h-full self-stretch font-medium`}
              text={"Generate QR"}
              isPending={isCreateQRPending}
              state={selectedIds.length > 0 ? "default" : "outline"}
              type="button"
              onClick={() => {
                generateQR(selectedIds);
              }}
            />
            <ButtonSm
              className="font-medium text-white"
              text={"New Entry"}
              state="default"
              type="button"
              onClick={() => {
                setSelectedMachine(dummyMachineData);
                setFormState("create");
                setIsFormOpen(true);
              }}
              iconPosition="right"
              imgUrl="/icons/plus-icon.svg"
            />
            <ButtonSm
              className="font-medium text-white opacity-100"
              text={isSm ? "" : "Import"}
              state="default"
              type="button"
              iconPosition="right"
              imgUrl="/icons/ArrowDown.svg"
              onClick={handleImportClick}
            />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBarWithFilter
          filters={["client-name", "brand", "machine-type"]}
          onFilterChange={handleFilterChange}
          onSearch={setSearchValue}
          value={searchValue}
          
          onChange={(e) => {
            setSearchValue(e.target.value);
            refetch();
            console.log(e.target.value);
            console.log(activeFilter);
          }}
        />

        {/* filter we wll add it later */}
      </header>

      {/* Table */}
      <div>
        {isLoading ? (
          <EmployeeTableSkeleton />
        ) : (
          <div className="flex flex-col items-start justify-start gap-2 overflow-clip rounded-[12px] bg-white/80 py-3 md:p-4">
            {/* Top Bar */}
            <div className="flex w-full items-center justify-between px-3 md:px-0">
              <section className="result-length flex w-full flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-blue-500"></div>
                  <h2 className="text-md min-w-max font-semibold text-zinc-800">
                    Showing {paginatedData.length} results of{" "}
                    {data?.totalRecords || 0}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`flex flex-row gap-2 rounded-md border border-blue-500 bg-blue-500/10 px-2 py-2 transition-all md:px-3 ${
                      selectedIds.length === 0 ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <h3 className="md:text-md text-sm font-medium text-blue-500">
                      Selected {selectedIds.length}
                    </h3>
                    <img
                      onClick={() => setSelectedIds([])}
                      src="/icons/chip-x-icon.svg"
                      alt="Clear"
                      className="cursor-pointer transition-transform duration-200 hover:scale-125"
                    />
                  </div>
                  <PaginationControls
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </section>
            </div>

            {/* Table Container */}
            <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto bg-white shadow-sm md:overflow-x-auto md:rounded-[9px]">
              {/* Header */}
              <header className="header flex min-w-max flex-row items-center justify-between bg-slate-200 px-3 py-3 md:min-w-max">
                {/* S.No + Checkbox */}
                <div className="flex w-20 min-w-20 items-center justify-start gap-2">
                  <p className="w-10 text-sm font-semibold text-zinc-900">
                    S.No
                  </p>
                  <CheckboxInput
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    label=""
                  />
                </div>

                {/* Column Headers with responsive widths */}
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-zinc-900">
                    Reference No
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
                  <p className="text-sm font-semibold text-zinc-900">Model</p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-zinc-900">
                    Machine S No
                  </p>
                </div>
                <div className="w-28 min-w-28 px-2 md:w-32 md:min-w-32">
                  <p className="text-sm font-semibold text-zinc-900">
                    Installation Date
                  </p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-zinc-900">
                    Installed By
                  </p>
                </div>

                {/* Action Header */}
                <div className="flex w-24 min-w-24 flex-col items-start px-2 md:w-28 md:min-w-28">
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
                    <div className="flex w-20 min-w-20 items-center justify-start gap-2 pt-1">
                      <p className="w-10">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </p>
                      <CheckboxInput
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        label=""
                      />
                    </div>

                    {/* Data Columns with responsive widths */}
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.referenceNumber}
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
                    <div className="w-20 min-w-20 px-2 pt-1 md:w-24 md:min-w-24">
                      <p className="leading-5 break-words">
                        {item.modelNumber}
                      </p>
                    </div>
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.serialNumber || "—"}
                      </p>
                    </div>
                    <div className="w-28 min-w-28 px-2 pt-1 md:w-32 md:min-w-32">
                      <p className="leading-5 break-words">
                        {item.installationDate || "—"}
                      </p>
                    </div>
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.installedByEngineerName || "—"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-24 min-w-24 flex-row items-center gap-2 px-2 md:w-28 md:min-w-28">
                      <ButtonSm
                        className="aspect-square scale-90 border border-blue-500 bg-blue-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMachine(item);
                          setFormState("edit");
                          setIsFormOpen(true);
                        }}
                        state="outline"
                        imgUrl="/icons/edit-icon.svg"
                      />
                      <ButtonSm
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMachine(item);
                          setIsDeleteMachineDialogOpen(true);
                        }}
                        className="aspect-square scale-90 border border-red-500 bg-red-100 text-red-500 hover:bg-red-100 active:bg-red-100"
                        state="default"
                        imgUrl="/icons/delete-icon.svg"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
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
        {isDeleteDialogOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[600px]"
          >
            <DeleteMachineDialogBox
              client={selectedMachine}
              setIsDeleteMachineDialogOpen={setIsDeleteMachineDialogOpen}
              onDeleted={() => {
                setSelectedMachine(null);
              }}
            />
          </DialogBox>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFormOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[800px]"
          >
            <MachineFormPage
              mode={formState}
              machineFromParent={selectedMachine}
              setFormVisible={setIsFormOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>
      <MachineImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default MachineEntry;
