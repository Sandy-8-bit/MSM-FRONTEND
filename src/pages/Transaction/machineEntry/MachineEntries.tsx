import {
  useCreateMachineQR,
  useFetchMachine,
} from "../../../queries/TranscationQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import { DeleteMachineDialogBox } from "./MachineEntryDelete.Dialog";
import { useCallback, useState } from "react";
import type { MachineDetails } from "@/types/transactionTypes";
import MachineFormPage from "./MachineForm";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import type { FormState } from "@/types/appTypes";
import { convertToFrontendDate } from "@/utils/commonUtils";
import { useBreakpoints } from "@/hooks/useBreakPoints";
import MachineImportModal from "./MachineImportModal";
import type { DataCell } from "@/components/common/GenericTable";
import GenericTable from "@/components/common/GenericTable";

const dataCell: DataCell[] = [
  {
    headingTitle: "Reference No",
    accessVar: "referenceNumber",
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
    headingTitle: "Model",
    accessVar: "modelNumber",
    searchable: true,
    sortable: true,
    className: "w-20 min-w-20 px-2 md:w-24 md:min-w-24",
  },
  {
    headingTitle: "Machine S No",
    accessVar: "serialNumber",
    searchable: true,
    sortable: true,
    className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
  },
  {
    headingTitle: "Installation Date",
    accessVar: "installationDate",
    searchable: true,
    sortable: true,
    className: "w-28 min-w-28 px-2 md:w-32 md:min-w-32",
  },
  {
    headingTitle: "Installed By",
    accessVar: "installedByEngineerName",
    searchable: true,
    sortable: true,
    className: "w-24 min-w-24 px-2 md:w-28 md:min-w-28",
  },
];

export interface MachineEntrySearchParam {
  status: string;
  requestDateFrom: string;
  requestDateTo: string;
  clientName: string;
  machineType: string;
  brand: string;
}

const MachineEntry = () => {
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteMachineDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { isSm } = useBreakpoints();

  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("client-name");

  const { data, isLoading } = useFetchMachine(
    activeFilter === "client-name" ? searchValue : undefined,
    activeFilter === "machine-type" ? searchValue : undefined,
    activeFilter === "brand" ? searchValue : undefined,
  );

  const { mutate: generateQR, isPending: isCreateQRPending } =
    useCreateMachineQR();

  const machineEntryData = data?.data || [];

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleSelectionChange = useCallback(
    (rows: any[], ids: (string | number)[]) => {
      setSelectedIds((prev) => {
        const next = ids as number[];
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    },
    [],
  );

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
        {/* <SearchBarWithFilter
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
        /> */}

        {/* filter we wll add it later */}
      </header>

      {/* Table */}
      <GenericTable
        data={{
          records: machineEntryData,
          totalRecords: data?.totalRecords,
        }}
        dataCell={dataCell}
        isLoading={isLoading}
        enableSelection
        getRowId={(row) => row.id} // important!
        onSelectedChange={handleSelectionChange} // exposes selected rows + ids
        onEdit={(row) => {
          setSelectedMachine(row);
          setFormState("edit");
          setIsFormOpen(true);
        }}
        onDelete={(row) => {
          setSelectedMachine(row);
          setIsDeleteMachineDialogOpen(true);
        }}
      />

      <AnimatePresence>
        {isDeleteDialogOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="p-5! lg:max-w-[450px]"
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
