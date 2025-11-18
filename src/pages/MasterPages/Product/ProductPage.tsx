import { useState,  } from "react";
import { AnimatePresence } from "framer-motion";
import ProductEdit from "./EditProduct.component";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteProductDialogBox } from "./DeleteProductDialogBox";
import { useFetchProductsPaginated } from "../../../queries/masterQueries/ProductQuery";

import type { FormState } from "../../../types/appTypes";
import type { ProductDetails } from "../../../types/masterApiTypes";
import GenericTable, { type DataCell } from "@/components/common/GenericTable";

const ProductsPage = () => {
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false);

  const [product, setProduct] = useState<ProductDetails>({
    id: 0,
    machineType: "",
    brand: "",
    modelNumber: "",
    description: "",
    remarks: ""
  });

  const [formState, setFormState] = useState<FormState>("create");


  const {
    data,
    isLoading,
    refetch,
  } = useFetchProductsPaginated(); // pass searchValue here

  const productList = data?.data || [];



  const handleRowClick = (item: ProductDetails) => {
    setProduct(item);
    setFormState("display");
  };

  const handleEdit = (item: ProductDetails) => {
    setProduct(item);
    setFormState("edit");
  };

  const handleDelete = (item: ProductDetails) => {
    setProduct(item);
    setIsDeleteProductDialogOpen(true);
  };
  const handleProductDeleted = () => {
    setProduct({
      id: 0,
      machineType: "",
      brand: "",
      modelNumber: "",
      description: "",
      remarks: ""
    });
    setFormState("create");
    refetch();
  };


  const dataCell: DataCell[] = [
    {
      headingTitle: "Machine Type",
      accessVar: "machineType",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "Brand",
      accessVar: "brand",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[180px]",
    },
    {
      headingTitle: "Model",
      accessVar: "modelNumber",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[180px]",
    },
  ];


  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteProductDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteProductDialogOpen}>
            <DeleteProductDialogBox
              setIsDeleteProductDialogOpen={setIsDeleteProductDialogOpen}
              product={product}
              onDeleted={handleProductDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col md:flex-row md:items-center items-start w-full justify-between">
          <div className="w-full justify-start items-center gap-2">
            <PageHeader title="Product Configuration" />
          </div>
        </header>

 <GenericTable
          isMasterTable
          data={productList}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleRowClick}
          rowKey={(row) => row.id}
          tableTitle="Product Configuration"
        />
      </section>

      {/* Right Form Section */}
      <section className="table-container mb-20 md:mb-0 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <ProductEdit
          productDetails={product}
          formState={formState}
          setFormState={setFormState}
          setProduct={setProduct}
        />
      </section>
    </main>
  );
};

export default ProductsPage;
