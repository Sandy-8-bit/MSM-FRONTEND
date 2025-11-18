import ButtonSm from "../../../components/common/Buttons";
import { useDeleteServiceEngineer } from "../../../queries/masterQueries/ServiceEngineersQuery";
import type { ServiceEngineerDetails } from "../../../types/masterApiTypes";

export const DeleteServiceEngineerDialogBox = ({
  setIsDeleteServiceEngineerDialogOpen,
  serviceEngineer,
  onDeleted,
}: {
  setIsDeleteServiceEngineerDialogOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  serviceEngineer: ServiceEngineerDetails;
  onDeleted?: () => void;
}) => {
  const {
    mutate: deleteServiceEngineer,
    isPending: isDeleteServiceEngineerLoading,
  } = useDeleteServiceEngineer();

  const handleDelete = () => {
    deleteServiceEngineer(serviceEngineer, {
      onSuccess: () => {
        setIsDeleteServiceEngineerDialogOpen(false);
        if (onDeleted) {
          onDeleted();
        }
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Service Engineer
        <img
          onClick={() => setIsDeleteServiceEngineerDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the service engineer{" "}
        <strong>{serviceEngineer?.engineerName}</strong>? This action is
        irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteServiceEngineerDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          isPending={isDeleteServiceEngineerLoading}
          text={"Delete"}
        />
      </section>
    </div>
  );
};
