import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import { useDeleteEntry } from "../../../queries/TranscationQueries/ServiceEntryQuery";
import type { ServiceEntryRequest } from "../../../types/transactionTypes";

export const DeleteEntryDialogBox = ({
  setIsDeleteMachineDialogOpen,
  Entry,
  onDeleted,
}: {
  setIsDeleteMachineDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  Entry: ServiceEntryRequest;
  onDeleted: () => void;
}) => {
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteEntry();

  const handleDelete = () => {
    deleteEntry(Entry.id as number, {
      onSuccess: () => {
        onDeleted();
        setIsDeleteMachineDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to delete entry for "${Entry.clientName}"`);
      },
    });
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}
    >
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Service Entry
        <img
          onClick={() => setIsDeleteMachineDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the service entry for{" "}
        <strong>{Entry.refNumber}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          disabled={isDeleting}
          onClick={() => setIsDeleteMachineDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          text={"Delete"}
          isPending={isDeleting}
          type="submit"
          disabled={isDeleting}
        />
      </section>
    </form>
  );
};
