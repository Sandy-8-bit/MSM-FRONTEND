import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence } from "framer-motion";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteServiceEngineerDialogBox } from "./ServiceEngineersDialogBox";

import ServiceEngineerEdit from "./EditEngineers.component";
import { useFetchServiceEngineers } from "../../../queries/masterQueries/ServiceEngineersQuery";
import { appRoutes } from "../../../routes/appRoutes";

// ✅ GenericTable import
import GenericTable, { type DataCell } from "../../../components/common/GenericTable";

import type { FormState } from "../../../types/appTypes";
import type { ServiceEngineerDetails } from "../../../types/masterApiTypes";

const ServiceEngineerPage = () => {
  const navigate = useNavigate();

  // ✅ Redirect if no token
  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] =
    useState<ServiceEngineerDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  const { data, isLoading } = useFetchServiceEngineers();
  const engineerList = data?.data || [];

  // ✅ Define GenericTable columns
  const dataCell: DataCell[] = [
    {
      headingTitle: "Engineer Name",
      accessVar: "engineerName",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "Mobile Number",
      accessVar: "engineerMobile",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
  ];

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && selectedEngineer && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteServiceEngineerDialogBox
              serviceEngineer={selectedEngineer}
              onDeleted={() => {
                setSelectedEngineer(null);
                setFormState("create");
              }}
              setIsDeleteServiceEngineerDialogOpen={setIsDeleteDialogOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <PageHeader title="Engineer Configuration" />
        </header>

        {/* ✅ GenericTable replaces manual rendering */}
        <GenericTable
          isMasterTable
          data={engineerList}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={(item) => {
            setFormState("edit");
            setSelectedEngineer(item);
          }}
          onDelete={(item) => {
            setFormState("create");
            setSelectedEngineer(item);
            setIsDeleteDialogOpen(true);
          }}
          onView={(item) => {
            setFormState("display");
            setSelectedEngineer(item);
          }}
          rowKey={(row) => row.id}
          tableTitle="Engineer Configuration"
        />
      </section>

      {/* Edit/Create Form Section */}
      <section className="table-container mb-20 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:mb-0 md:w-[50%]">
        <ServiceEngineerEdit
          serviceEngineerDetails={selectedEngineer}
          formState={formState}
          setFormState={setFormState}
          setServiceEngineerData={setSelectedEngineer}
        />
      </section>
    </main>
  );
};

export default ServiceEngineerPage;
