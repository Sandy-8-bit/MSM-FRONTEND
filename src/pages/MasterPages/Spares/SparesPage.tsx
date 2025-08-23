import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteSpareDialogBox } from "./DeleteSpares";

import type { FormState } from "../../../types/appTypes";
import type { SpareDetails } from "../../../types/masterApiTypes";
import { useFetchSparesPaginated } from "../../../queries/masterQueries/SpareQuery";
import SpareEdit from "./Spares.component";

// ✅ GenericTable import
import GenericTable, {
  type DataCell,
} from "../../../components/common/GenericTable";
import Cookies from "js-cookie";
import { appRoutes } from "@/routes/appRoutes";
import { useNavigate } from "react-router-dom";

const SparesPage = () => {
  const navigate = useNavigate()
    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        navigate(appRoutes.signInPage);
      }
    }, [navigate]);
  const [isDeleteSpareDialogOpen, setIsDeleteSpareDialogOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState<SpareDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isLoading } = useFetchSparesPaginated();

  const spareList = data?.data || [];

  // ✅ Define GenericTable columns
  const dataCell: DataCell[] = [
    {
      headingTitle: "Spare Name",
      accessVar: "spareName",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "Part Number",
      accessVar: "partNumber",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
  ];

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteSpareDialogOpen && selectedSpare && (
          <DialogBox setToggleDialogueBox={setIsDeleteSpareDialogOpen}>
            <DeleteSpareDialogBox
              setIsDeleteSpareDialogOpen={setIsDeleteSpareDialogOpen}
              spare={selectedSpare}
              setSpare={setSelectedSpare}
              setFormState={setFormState}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <PageHeader title="Spare Configuration" />
        </header>

        {/* ✅ GenericTable replaces manual rendering */}
        <GenericTable
          isMasterTable
          data={spareList}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={(item) => {
            setFormState("edit");
            setSelectedSpare(item);
          }}
          onDelete={(item) => {
            setFormState("create");
            setSelectedSpare(item);
            setIsDeleteSpareDialogOpen(true);
          }}
          onView={(item) => {
            setFormState("display");
            setSelectedSpare(item);
          }}
          rowKey={(row) => row.id}
          tableTitle="Spare Configuration"
        />
      </section>

      {/* Edit/Create Form Section */}
      <section className="table-container mb-20 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:mb-0 md:w-[50%]">
        <SpareEdit
          spareDetails={selectedSpare}
          formState={formState}
          setFormState={setFormState}
          setSelectedSpare={setSelectedSpare}
          isImportModalOpen={isImportModalOpen}
          setIsImportModalOpen={setIsImportModalOpen}
        />
      </section>
    </main>
  );
};

export default SparesPage;
