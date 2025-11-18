import ButtonSm from "../../../components/common/Buttons";
import { useDeleteVendor } from "../../../queries/masterQueries/VendorQuery";
import type { VendorDetails } from "../../../types/masterApiTypes";
import type { FormState } from "../../../types/appTypes";

export const DeleteVendorDialogBox = ({
  setIsDeleteVendorDialogOpen,
  setFormState,
  setVendor,
  vendor,
  onDeleted,
  refetchVendors,
}: {
  setIsDeleteVendorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setVendor: React.Dispatch<React.SetStateAction<VendorDetails | null>>;
  vendor: VendorDetails;
  onDeleted?: () => void;
  refetchVendors: () => void;
}) => {
  const { mutate: deleteVendor, isPending: isDeleteVendorLoading } =
    useDeleteVendor();

  const handleDelete = () => {
    if (!vendor) return;

    deleteVendor(vendor, {
      onSuccess: () => {
        setIsDeleteVendorDialogOpen(false);
        setFormState("create");
        setVendor(null);
        refetchVendors(); // ✅ update the list without reload
        if (onDeleted) onDeleted();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Vendor
        <img
          onClick={() => setIsDeleteVendorDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the vendor{" "}
        <strong>{vendor.vendorName}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteVendorDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          isPending={isDeleteVendorLoading}
          text={"Delete"}
        />
      </section>
    </div>
  );
};
