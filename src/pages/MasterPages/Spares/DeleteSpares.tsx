import { useEffect } from "react";
import ButtonSm from "../../../components/common/Buttons";
import type { SpareDetails } from "../../../types/masterApiTypes";
import type { FormState } from "../../../types/appTypes";
import { useDeleteSpare } from "@/queries/masterQueries/SpareQuery";

export const DeleteSpareDialogBox = ({
  setIsDeleteSpareDialogOpen,
  setFormState,
  setSpare,
  spare,
}: {
  setIsDeleteSpareDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setSpare: React.Dispatch<React.SetStateAction<SpareDetails | null>>;
  spare: SpareDetails;
}) => {
  const {
    mutate: deleteSpare,
    isPending: isDeleteSpareLoading,
    isSuccess,
  } = useDeleteSpare();

  //Dummy data for cleanuo
  const emptySpare: SpareDetails = {
    spareName: "",
    remarks: "",
    partNumber: "",
    description:"",
    id: 0,
  };

  useEffect(() => {
    if (isSuccess) {
      setFormState("create");
      setSpare(emptySpare);
    }
  }, [isSuccess]);

  const handleDelete = (spare: SpareDetails) => {
    deleteSpare(spare.id);
    setIsDeleteSpareDialogOpen(false);
    setSpare(emptySpare);
    setFormState("create");
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete(spare);
        setIsDeleteSpareDialogOpen(false);
      }}
    >
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Spare
        <img
          onClick={() => setIsDeleteSpareDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the spare{" "}
        <strong>{spare.spareName}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteSpareDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          text={"Delete"}
          isPending={isDeleteSpareLoading}
          onClick={() => {
            handleDelete(spare);
            setIsDeleteSpareDialogOpen(false);
          }}
        />
      </section>
    </form>
  );
};
