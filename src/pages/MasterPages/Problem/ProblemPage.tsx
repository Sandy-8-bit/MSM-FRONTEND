import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import PaginationControls from "../../../components/common/Pagination";

import ProblemEdit from "./EditProblem.component";
import { DeleteProblemDialogBox } from "../../MasterPages/Problem/ProblemDialogBox";

import { useFetchProblem } from "../../../queries/masterQueries/Problem-types";
import { appRoutes } from "../../../routes/appRoutes";

import type { FormState } from "../../../types/appTypes";
import type { ProblemDetails } from "../../../types/masterApiTypes";
import GenericTable, { type DataCell } from "@/components/common/GenericTable";

const ProblemPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [isDeleteProblemDialogOpen, setIsDeleteProblemDialogOpen] =
    useState(false);
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  const { data, isLoading, isError, refetch } = useFetchProblem();

  const problemList = data?.data || [];

  const handleRowClick = (item: ProblemDetails) => {
    setProblem(item);
    setFormState("display");
  };

  const handleEdit = (item: ProblemDetails) => {
    setProblem(item);
    setFormState("edit");
  };

  const handleDelete = (item: ProblemDetails) => {
    setProblem(item);
    setIsDeleteProblemDialogOpen(true);
  };

  const handleProblemDeleted = () => {
    setProblem(null);
    setFormState("create");
    refetch();
  };

  // Table column config
  const dataCell: DataCell[] = [
    {
      headingTitle: "Problem Type",
      accessVar: "problemType",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "Description",
      accessVar: "description",
      searchable: true,
      sortable: true,
      className: "min-w-[200px] max-w-[300px]",
    },
  ];

  return (
    <>
      <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
        {/* Left Table Section */}
        <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
          <header className="flex flex-col md:flex-row md:items-center items-start w-full justify-between">
            <div className="w-full justify-start items-center gap-2">
              <PageHeader title="Problem Configuration" />
            </div>
          </header>

          <GenericTable
            isMasterTable
            data={problemList}
            dataCell={dataCell}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleRowClick}
            rowKey={(row) => row.id}
            tableTitle="Problem Configuration"
          />
        </section>

        {/* Right Form Section */}
        <section className="table-container mb-20 md:mb-0 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
          <ProblemEdit
            problemDetails={problem}
            formState={formState}
            setFormState={setFormState}
            setProblemData={setProblem}
          />
        </section>
      </main>

      {/* Delete Dialog */}
      {isDeleteProblemDialogOpen && problem && (
        <DialogBox setToggleDialogueBox={setIsDeleteProblemDialogOpen}>
          <DeleteProblemDialogBox
            problem={problem}
            onDeleted={handleProblemDeleted}
            setIsDeleteProblemDialogOpen={setIsDeleteProblemDialogOpen}
          />
        </DialogBox>
      )}
    </>
  );
};

export default ProblemPage;
