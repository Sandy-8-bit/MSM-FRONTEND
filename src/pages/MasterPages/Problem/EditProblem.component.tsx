import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { ProblemDetails } from "../../../types/masterApiTypes";
import {
  useCreateProblem,
  useEditProblem,
} from "../../../queries/masterQueries/Problem-types";
import TextArea from "../../../components/common/Textarea";
import isEqual from "lodash.isequal";

const emptyProblem: ProblemDetails = {
  id: 0,
  problemType: "",
  description: "",
  remarks: "",
};
const ProblemEdit = ({
  problemDetails,
  formState,
  setFormState,
  setProblemData,
}: {
  problemDetails: ProblemDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setProblemData: React.Dispatch<React.SetStateAction<ProblemDetails | null>>;
}) => {
  const [newProblemData, setNewProblemData] =
    useState<ProblemDetails>(emptyProblem);

  const { mutate: createProblem, isPending, isSuccess } = useCreateProblem();
  const {
    mutate: editProblem,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditProblem();

  useEffect(() => {
    if (formState === "create") {
      setNewProblemData(emptyProblem);
    } else if (problemDetails) {
      setNewProblemData(problemDetails); // Ensures ID is preserved
    }
  }, [formState, problemDetails]);

  useEffect(() => {
    if (isSuccess || isUpdatingSuccess) {
      setFormState("create");
      setProblemData(null);
      setNewProblemData(emptyProblem);
    }
  }, [isSuccess, isUpdatingSuccess, setFormState, setProblemData]);

  const handleCancel = () => {
    setFormState("create");
    setProblemData(null);
    setNewProblemData(emptyProblem);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newProblemData.problemType || !newProblemData.description) {
      console.log("Missing required fields");
      return;
    }

    console.log("Form submitted with state:", formState);
    console.log("Problem data:", newProblemData);

    if (formState === "create") {
      createProblem(newProblemData);
    } else if (formState === "edit") {
      editProblem(newProblemData);
    }
  };

  const hasData = newProblemData?.problemType || newProblemData?.description;

  if (!newProblemData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a problem to view details.
      </p>
    );
  }

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="loan-config-container flex flex-col gap-3 rounded-[20px] bg-white/80">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <header className="header flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Problem Configuration"
                : `${problemDetails?.problemType || "Problem"} Configuration`}
            </h1>
            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "display" && newProblemData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={"Create New"}
                  state="default"
                  isPending={isPending}
                  type="submit"
                  disabled={isPending}
                />
              )}
              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text="Save Changes"
                  isPending={isUpdatePending}
                  state="default"
                  type="submit"
                  disabled={
                    isUpdatePending || isEqual(newProblemData, problemDetails)
                  }
                />
              )}
            </section>
          </header>

          <section className="loan-details-section flex w-full flex-col gap-2 overflow-clip px-3">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
              <Input
                required
                disabled={formState === "display"}
                title="Problem Type"
                type="str"
                inputValue={newProblemData.problemType}
                name="problem"
                placeholder="Enter problem type"
                maxLength={50}
                onChange={(value) =>
                  setNewProblemData({ ...newProblemData, problemType: value })
                }
              />
            </div>

            <TextArea
              disabled={formState === "display"}
              title="Description"
              inputValue={newProblemData.description}
              name="description"
              placeholder="Enter description"
              maxLength={200}
              onChange={(value) =>
                setNewProblemData({ ...newProblemData, description: value })
              }
            />
          </section>
          {/* <div className="px-3">
            <TextArea
              title="Remarks"
              name="Remarks"
              placeholder="Remarks"
              disabled={formState === "display"}
              inputValue={newProblemData.remarks}
              onChange={(value) =>
                setNewProblemData({ ...newProblemData, remarks: value })
              }
            />
          </div> */}
        </form>
      </div>
    </main>
  );
};

export default ProblemEdit;
