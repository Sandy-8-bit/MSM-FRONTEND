import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import { useDeleteProduct } from "../../../queries/masterQueries/ProductQuery";
import type { ProductDetails } from "../../../types/masterApiTypes";

export const DeleteProductDialogBox = ({
  setIsDeleteProductDialogOpen,
  product,
  onDeleted,
}: {
  setIsDeleteProductDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductDetails;
  onDeleted: () => void;
}) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(product, {
      onSuccess: () => {
        onDeleted();
        setIsDeleteProductDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to delete product "${product.machineType}"`);
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
        Delete Product
        <img
          onClick={() => setIsDeleteProductDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the product{" "}
        <strong>{product.machineType}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          disabled={isDeleting}
          onClick={() => setIsDeleteProductDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          text={isDeleting ? "Deleting..." : "Delete"}
          type="submit"
          isPending={isDeleting}
          disabled={isDeleting}
        />
      </section>
    </form>
  );
};
