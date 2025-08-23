import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence } from "motion/react";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteVendorDialogBox } from "./DeleteVendorDialogBox";
import VendorEdit from "./EditVendor.component";
import { useFetchVendorsPaginated } from "../../../queries/masterQueries/VendorQuery";

import { appRoutes } from "../../../routes/appRoutes";
import type { VendorDetails } from "../../../types/masterApiTypes";
import type { FormState } from "../../../types/appTypes";

// ✅ GenericTable import
import GenericTable, {
  type DataCell,
} from "../../../components/common/GenericTable";

const VendorsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [isDeleteVendorDialogOpen, setIsDeleteVendorDialogOpen] =
    useState(false);
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  // ✅ Fetch vendors with pagination (pass params as needed)
  const { data, isLoading, refetch } = useFetchVendorsPaginated();

  const vendorList = data?.data || [];

  // ✅ Define GenericTable columns
  const dataCell: DataCell[] = [
    {
      headingTitle: "Name",
      accessVar: "vendorName",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "Contact",
      accessVar: "contactPerson",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
  ];

  const handleRowClick = (item: VendorDetails) => {
    setVendor(item);
    setFormState("display");
  };

  const handleEdit = (item: VendorDetails) => {
    setVendor(item);
    setFormState("edit");
  };

  const handleDelete = (item: VendorDetails) => {
    setVendor(item);
    setIsDeleteVendorDialogOpen(true);
  };

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteVendorDialogOpen && vendor && (
          <DialogBox setToggleDialogueBox={setIsDeleteVendorDialogOpen}>
            <DeleteVendorDialogBox
              setIsDeleteVendorDialogOpen={setIsDeleteVendorDialogOpen}
              setFormState={setFormState}
              setVendor={setVendor}
              vendor={vendor}
              refetchVendors={refetch}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left - Vendor List Table */}
      <section className="table-container flex w-full flex-col rounded-[12px] bg-white/80 shadow-sm md:w-[50%]">
        <header className="mt-4 flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
          <PageHeader title="Vendor Configuration" />
        </header>

        {/* ✅ GenericTable replaces manual table */}
        <GenericTable
          isMasterTable
          data={vendorList}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleRowClick}
          rowKey={(row) => row.id}
          tableTitle="Vendor Configuration"
        />

        {/* Pagination Footer */}
      </section>

      {/* Right - Vendor Form */}
      <section className="table-container mb-20 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:mb-0 md:w-[50%]">
        <VendorEdit
          vendorDetails={vendor}
          formState={formState}
          setFormState={setFormState}
          setVendorData={setVendor}
        />
      </section>
    </main>
  );
};

export default VendorsPage;
