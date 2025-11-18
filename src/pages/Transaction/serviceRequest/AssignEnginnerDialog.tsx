import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import { useFetchServiceEngineerOptions } from "@/queries/masterQueries/ServiceEngineersQuery";
import type { ServiceRequest } from "@/types/transactionTypes";
import { usePatchServiceRequest } from "@/queries/TranscationQueries/ServiceRequestQuery";

export const AssignEngineerDialogBox = ({
  setIsAssignDialogOpen,
  serviceRequestData,
}: {
  setIsAssignDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceRequestData: ServiceRequest;
}) => {
  const { data: engineerOptions = [] } = useFetchServiceEngineerOptions();
  const [selectedEngineer, setSelectedEngineer] = useState<DropdownOption>({
    id: 0,
    label: "Select Service Engineer",
  });

  useEffect(() => {
    if (engineerOptions) {
      setSelectedEngineer(
        engineerOptions.find(
          (engineer) => engineer.label === serviceRequestData.engineerName,
        ) || selectedEngineer,
      );
    }
  }, [engineerOptions]);

  const { mutate: updateServiceEngineer, isPending: isAssigning } =
    usePatchServiceRequest();

  const handleAssign = () => {
    if (!selectedEngineer) {
      toast.warn("Please select an engineer to assign.");
      return;
    }

    updateServiceEngineer(
      {
        id: serviceRequestData.id,
        engineerId: selectedEngineer.id,
      },
      {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
        },
      },
    );
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleAssign();
      }}
    >
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-blue-500">
        Assign Service Engineer
        <img
          onClick={() => setIsAssignDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <DropdownSelect
        title="Select Engineer"
        options={engineerOptions}
        selected={selectedEngineer}
        onChange={(val) => setSelectedEngineer(val)}
        required
      />

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          disabled={isAssigning}
          onClick={() => setIsAssignDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-blue-500 text-center text-white hover:bg-blue-600 active:bg-blue-700"
          state="default"
          text={"Assign"}
          isPending={isAssigning}
          type="submit"
          disabled={isAssigning}
        />
      </section>
    </form>
  );
};
