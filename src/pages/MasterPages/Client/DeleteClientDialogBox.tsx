import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import { useDeleteClient } from "../../../queries/masterQueries/ClientQuery";
import type { ClientDetails } from "../../../types/masterApiTypes";

export const DeleteClientDialogBox = ({
  setIsDeleteClientDialogOpen,
  client,
  onDeleted,
}: {
  setIsDeleteClientDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  client: ClientDetails;
  onDeleted: () => void;
}) => {
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const handleDelete = () => {
    deleteClient(client, {
      onSuccess: () => {
        onDeleted();
        setIsDeleteClientDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to delete client "${client.clientName}"`);
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
        Delete Client
        <img
          onClick={() => setIsDeleteClientDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the client{" "}
        <strong>{client.clientName}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          disabled={isDeleting}
          onClick={() => setIsDeleteClientDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          isPending={isDeleting}
          text={"Delete"}
          type="submit"
          disabled={isDeleting}
        />
      </section>
    </form>
  );
};
