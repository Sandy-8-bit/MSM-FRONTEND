import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import TextArea from "../../../components/common/Textarea";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { ProductDetails } from "../../../types/masterApiTypes";
import {
  useCreateProduct,
  useEditProduct,
} from "../../../queries/masterQueries/ProductQuery";
import ImportModal from "./ProductImportModal";

const ProductEdit = ({
  productDetails,
  formState,
  setFormState,
  setProduct,
}: {
  productDetails: ProductDetails;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setProduct: React.Dispatch<React.SetStateAction<ProductDetails>>;
}) => {
  const [productData, setProductData] = useState<ProductDetails | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { mutate: createProduct, isPending, isSuccess } = useCreateProduct();

  const {
    mutate: updateProduct,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditProduct();

  const disableButton =
    productDetails?.machineType === productData?.machineType &&
    productDetails?.brand === productData?.brand &&
    productDetails?.modelNumber === productData?.modelNumber &&
    productDetails?.description === productData?.description;

  useEffect(() => {
    if (formState === "create") {
      setProductData({
        id: 0,
        machineType: "",
        brand: "",
        modelNumber: "",
        description: "",
        remarks: "",
      });
    } else if (productDetails) {
      setProductData(productDetails);
    }
  }, [productDetails, formState]);

  useEffect(() => {
    if (isSuccess) {
      const resetData: ProductDetails = {
        id: 0,
        machineType: "",
        brand: "",
        modelNumber: "",
        description: "",
        remarks: "",
      };
      setFormState("create");
      setProduct(resetData);
      setProductData(resetData);
    } else if (isUpdatingSuccess && productData) {
      setFormState("create");
      setProduct(productData);
    }
  }, [isSuccess, isUpdatingSuccess]);

  const handleCancel = () => {
    setFormState("create");
    const resetData: ProductDetails = {
      id: 0,
      machineType: "",
      brand: "",
      modelNumber: "",
      description: "",
      remarks: "",
    };
    setProduct(resetData);
    setProductData(resetData);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  if (!productData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a product to view details.
      </p>
    );
  }

  const hasData =
    productData.machineType ||
    productData.brand ||
    productData.modelNumber ||
    productData.description;

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="product-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState === "create" && productData) {
              createProduct(productData);
            }
          }}
        >
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Product Configuration"
                : `${productDetails?.machineType} Configuration`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}

              {formState === "display" && productData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
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
                    className="font-medium text-white"
                    text={isPending ? "Creating..." : "Create New"}
                    state="default"
                    isPending={isPending}
                    type="submit"
                    disabled={isPending}
                  />
                </>
              )}

              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text={isUpdatePending ? "Updating..." : "Save Changes"}
                  state="default"
                  type="button"
                  isPending={isUpdatePending}
                  disabled={disableButton || isUpdatePending}
                  onClick={() => {
                    if (productData) {
                      updateProduct(productData);
                    }
                  }}
                />
              )}
            </section>
          </header>

          {/* Product Inputs */}
          <section className="flex w-full flex-col gap-2 overflow-clip px-3">
            <Input
              required
              disabled={formState === "display"}
              title="Machine Type"
              type="str"
              inputValue={productData.machineType}
              name="machineType"
              placeholder="Enter machine type"
              maxLength={50}
              onChange={(value) =>
                setProductData({ ...productData, machineType: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Brand"
              type="str"
              inputValue={productData.brand}
              name="brand"
              placeholder="Enter brand"
              maxLength={50}
              onChange={(value) =>
                setProductData({ ...productData, brand: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Model Number"
              type="str"
              inputValue={productData.modelNumber}
              name="modelNumber"
              placeholder="Enter model number"
              maxLength={50}
              onChange={(value) =>
                setProductData({ ...productData, modelNumber: value })
              }
            />
            <TextArea
              disabled={formState === "display"}
              title="Description (optional)"
              inputValue={productData.description}
              name="description"
              placeholder="Enter description (optional)"
              maxLength={300}
              onChange={(value) =>
                setProductData({ ...productData, description: value })
              }
            />
          </section>
          {/* <div className="px-3">
            <TextArea
              title="Remarks"
              name="Remarks"
              placeholder="Remarks"
              disabled={formState === "display"}
              inputValue={productData.remarks}
              onChange={(value) =>
                setProductData({ ...productData, remarks: value })
              }
            />
          </div> */}
        </form>
      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </main>
  );
};

export default ProductEdit;
