import ButtonSm from "../../../components/common/Buttons";
import { useDeleteProblem } from "../../../queries/masterQueries/Problem-types";
import type { ProblemDetails } from "../../../types/masterApiTypes";

export const DeleteProblemDialogBox = ({
  setIsDeleteProblemDialogOpen,
  problem,
  onDeleted,
}: {
  setIsDeleteProblemDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  problem: ProblemDetails;
  onDeleted?: () => void;
}) => {
  const { mutate: deleteProblem, isPending: isDeleteProblemLoading } =
    useDeleteProblem();

  const handleDelete = () => {
    deleteProblem(problem, {
      onSuccess: () => {
        setIsDeleteProblemDialogOpen(false);
        if (onDeleted) {
          onDeleted();
        }
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Problem
        <img
          onClick={() => setIsDeleteProblemDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the branch{" "}
        <strong>{problem?.problemType}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteProblemDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          text={"Delete"}
          isPending={isDeleteProblemLoading}
        />
      </section>
    </div>
  );
};
