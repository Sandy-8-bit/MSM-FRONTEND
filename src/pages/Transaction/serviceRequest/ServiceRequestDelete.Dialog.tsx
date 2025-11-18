import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import { useDeleteServiceRequest } from "../../../queries/TranscationQueries/ServiceRequestQuery";
import type { ServiceRequest } from "../../../types/transactionTypes";

export const DeleteServiceRequestDialogBox = ({
  setIsDeleteDialogOpen,
  request,
  onDeleted,
}: {
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  request: ServiceRequest;
  onDeleted: () => void;
}) => {
  const { mutate: deleteServiceRequest, isPending: isDeleting } =
    useDeleteServiceRequest();

  const handleDelete = () => {
    if (!request?.id) {
      toast.error("Invalid request. Cannot delete.");
      return;
    }

    deleteServiceRequest(request.id, {
      onSuccess: () => {
        onDeleted();
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to delete request "${request.referenceNumber}"`);
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
        Delete Service Request
        <img
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the request{" "}
        <strong>
          {request.referenceNumber} {request.clientName}
        </strong>
        ? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          disabled={isDeleting}
          onClick={() => setIsDeleteDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          text={"Delete"}
          type="submit"
          isPending={isDeleting}
          disabled={isDeleting}
        />
      </section>
    </form>
  );
};
