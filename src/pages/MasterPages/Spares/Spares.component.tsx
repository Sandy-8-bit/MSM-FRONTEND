import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { SpareDetails } from "../../../types/masterApiTypes";
import { motion } from "framer-motion";
import isEqual from "lodash.isequal";
import {
  useCreateSpare,
  useEditSpare,
} from "../../../queries/masterQueries/SpareQuery";
import TextArea from "@/components/common/Textarea";
import SpareImportModal from "./SpareImportModal"; // Adjust the import path based on your structure

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface SpareEditProps {
  spareDetails: SpareDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setSelectedSpare: React.Dispatch<React.SetStateAction<SpareDetails | null>>;
  isImportModalOpen: boolean;
  setIsImportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpareEdit = ({
  spareDetails,
  formState,
  setFormState,
  setSelectedSpare,
  isImportModalOpen,
  setIsImportModalOpen,
}: SpareEditProps) => {
  const [spareData, setSpareData] = useState<SpareDetails | null>(null);
  const [newSpareData, setNewSpareData] = useState<SpareDetails | null>(null);

  const { mutate: createSpare, isPending, isSuccess } = useCreateSpare();
  const {
    mutate: updateSpare,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditSpare();

  const emptySpare: SpareDetails = {
    id: 0,
    spareName: "",
    partNumber: "",
    remarks: "",
    description: "",
  };

  useEffect(() => {
    if (formState === "create") {
      setSpareData(emptySpare);
      setNewSpareData(emptySpare);
    } else if (spareDetails) {
      setSpareData(spareDetails);
      setNewSpareData(spareDetails);
    }
  }, [spareDetails, formState]);

  useEffect(() => {
    if (isSuccess || isUpdatingSuccess) {
      resetForm();
    }
  }, [isSuccess, isUpdatingSuccess]);

  const resetForm = () => {
    setNewSpareData(emptySpare);
    setSpareData(null);
    setSelectedSpare(null);
    setFormState("create");
  };

  const handleCancel = () => {
    resetForm();
  };

  if (!newSpareData && formState !== "create") {
    return (
      <p className="text-md my-1 self-center-safe text-center text-gray-600">
        Select a spare to view its details.
      </p>
    );
  }

  const isDirty =
    formState === "create"
      ? !isEqual(newSpareData, emptySpare)
      : !isEqual(newSpareData, spareData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpareData) return;

    if (formState === "create") {
      createSpare(newSpareData);
    } else {
      updateSpare(newSpareData);
    }
  };

  const handleImportClick = () => {
    console.log("Import button clicked, setting isImportModalOpen to true");
    setIsImportModalOpen(true);
  };

  console.log("SpareEdit render, isImportModalOpen:", isImportModalOpen); // Debug log

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex max-h-full w-full max-w-[870px] flex-col gap-2"
    >
      <motion.div
        variants={containerVariants}
        className="spare-config-container flex flex-col gap-3 rounded-[20px]"
      >
        <form onSubmit={handleSubmit}>
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="my-1 text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Create Spare"
                : `${spareData?.spareName ?? "Spare"} Configuration`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                formState === "display" ||
                (formState === "create" && isDirty)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  onClick={handleCancel}
                />
              )}

              {formState === "create" && (
                <>
                  <ButtonSm
                    className="font-medium text-white opacity-100"
                    text="Import"
                    state="default"
                    type="button"
                    iconPosition="right"
                    imgUrl="/icons/ArrowDown.svg"
                    onClick={handleImportClick}
                  />
                  <ButtonSm
                    type="submit"
                    className="font-semibold text-white"
                    state="default"
                    text="Create"
                    isPending={isPending}
                    disabled={!isDirty}
                  />
                </>
              )}

              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text="Save Changes"
                  isPending={isUpdatePending}
                  state="default"
                  type="submit"
                  disabled={!isDirty}
                />
              )}
            </section>
          </header>

          <section className="spare-details-section flex max-h-full w-full flex-col gap-2 overflow-clip px-3">
            <Input
              required
              disabled={formState === "display"}
              title="Spare Name"
              type="str"
              inputValue={newSpareData?.spareName ?? ""}
              name="spareName"
              placeholder="Enter spare name"
              maxLength={50}
              onChange={(value: string) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, spareName: value });
              }}
            />

            <Input
              required
              disabled={formState === "display"}
              title="Part Number"
              type="str"
              inputValue={newSpareData?.partNumber ?? ""}
              name="partNumber"
              placeholder="Enter part number"
              maxLength={50}
              onChange={(value: string) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, partNumber: value });
              }}
            />

            <TextArea
              title="Description"
              name="description"
              placeholder="Description"
              disabled={formState === "display"}
              inputValue={newSpareData?.description ?? ""}
              onChange={(value) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, description: value });
              }}
            />
          </section>
          {/* <div className="px-3">
            <TextArea
              title="Remarks"
              name="Remarks"
              placeholder="Remarks"
              disabled={formState === "display"}
              inputValue={newSpareData?.remarks ?? ""}
              onChange={(value) => {
                if (!newSpareData) return;
                setNewSpareData({ ...newSpareData, remarks: value });
              }}
            />
          </div> */}
        </form>
      </motion.div>
      <SpareImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </motion.main>
  );
};

export default SpareEdit;
