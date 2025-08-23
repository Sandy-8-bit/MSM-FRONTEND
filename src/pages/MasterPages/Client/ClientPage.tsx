import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";

import ClientEdit from "./EditClient.component";
import { DeleteClientDialogBox } from "./DeleteClientDialogBox";

import { useFetchClientsPaginated } from "../../../queries/masterQueries/ClientQuery";

import type { FormState } from "../../../types/appTypes";
import type { ClientDetails } from "../../../types/masterApiTypes";
import GenericTable, { type DataCell } from "@/components/common/GenericTable";

const ClientPage = () => {
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] =
    useState(false);

  const [client, setClient] = useState<ClientDetails>({
    id: 0,
    clientName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    pinCode: 0,
    city: "",
    state: "",
    gstNumber: "",
    remarks: "",
  });

  const [formState, setFormState] = useState<FormState>("create");

  const { data, isLoading, isError, refetch } = useFetchClientsPaginated();

  const clientList = data?.data || [];

  const handleRowClick = (item: ClientDetails) => {
    setClient(item);
    setFormState("display");
  };

  const handleEdit = (item: ClientDetails) => {
    setClient(item);
    setFormState("edit");
  };

  const handleDelete = (item: ClientDetails) => {
    setClient(item);
    setIsDeleteClientDialogOpen(true);
  };

  const handleClientDeleted = () => {
    setClient({
      id: 0,
      clientName: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: 0,
      city: "",
      state: "",
      gstNumber: "",
      remarks: "",
    });
    setFormState("create");
    refetch();
  };

  // Table columns
  const dataCell: DataCell[] = [
    {
      headingTitle: "Client Name",
      accessVar: "clientName",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[250px]",
    },
    {
      headingTitle: "Contact Number",
      accessVar: "contactNumber",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[180px]",
    },
    {
      headingTitle: "City",
      accessVar: "city",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[180px]",
    },
  ];

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteClientDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteClientDialogOpen}>
            <DeleteClientDialogBox
              setIsDeleteClientDialogOpen={setIsDeleteClientDialogOpen}
              client={client}
              onDeleted={handleClientDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left Table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <PageHeader title="Client Configuration" />
        </header>

        <GenericTable
          isMasterTable
          data={clientList}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleRowClick}
          rowKey={(row) => row.id}
          tableTitle="Client Configuration"
        />
      </section>

      {/* Right Form */}
      <section className="table-container mb-20 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:mb-0 md:w-[50%]">
        <ClientEdit
          clientDetails={client}
          formState={formState}
          setFormState={setFormState}
          setClient={setClient}
        />
      </section>
    </main>
  );
};

export default ClientPage;
