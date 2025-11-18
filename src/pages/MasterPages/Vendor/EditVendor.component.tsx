import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import {
  useCreateVendor,
  useEditVendor,
} from "../../../queries/masterQueries/VendorQuery";
import type { VendorDetails } from "../../../types/masterApiTypes";

const VendorEdit = ({
  vendorDetails,
  formState,
  setFormState,
}: {
  vendorDetails: VendorDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setVendorData: React.Dispatch<React.SetStateAction<VendorDetails | null>>;
}) => {
  const [vendorData, setVendorDataLocal] = useState<VendorDetails | null>(null);
  const [newVendorData, setNewVendorData] = useState<VendorDetails | null>(
    null,
  );
  const [title, setTitle] = useState("");

  const {
    mutate: createVendor,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = useCreateVendor();
  const {
    mutate: editVendor,
    isPending: isEditing,
    isSuccess: isEditSuccess,
  } = useEditVendor();

  const emptyVendor: VendorDetails = {
    id: 0,
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pinCode: 0,
    state: "",
    gstNumber: "",
    remarks: "",
  };

  useEffect(() => {
    if (formState === "create") {
      setVendorDataLocal(emptyVendor);
      setNewVendorData(emptyVendor);
      setTitle("");
    } else if (vendorDetails) {
      setVendorDataLocal(vendorDetails);
      setNewVendorData(vendorDetails);
      setTitle(vendorDetails.vendorName);
    }
  }, [vendorDetails, formState]);

  useEffect(() => {
    if (isCreateSuccess || isEditSuccess) {
      setVendorDataLocal(emptyVendor);
      setNewVendorData(emptyVendor);
      setFormState("create");
      setTitle("");
    }
  }, [isCreateSuccess, isEditSuccess]);

  const handleCancel = () => {
    setVendorDataLocal(emptyVendor);
    setNewVendorData(emptyVendor);
    setFormState("create");
    setTitle("");
  };

  const hasData =
    newVendorData?.vendorName ||
    newVendorData?.contactPerson ||
    newVendorData?.contactNumber ||
    newVendorData?.emailAddress ||
    newVendorData?.addressLine1 ||
    newVendorData?.addressLine2 ||
    newVendorData?.gstNumber ||
    newVendorData?.city ||
    newVendorData?.state ||
    newVendorData?.pinCode ||
    newVendorData?.gstNumber;

  if (!vendorData || !newVendorData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a vendor to view details.
      </p>
    );
  }

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="branch-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState === "create") {
              createVendor(newVendorData!);
            } else if (formState === "edit") {
              editVendor(newVendorData!);
            }
          }}
        >
          <header className="header flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Vendor Configuration"
                : `${title || "Vendor"} Configuration`}
            </h1>
            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  onClick={handleCancel}
                  type="button"
                />
              )}
              {formState === "display" && vendorData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  onClick={handleCancel}
                  type="button"
                />
              )}
              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={"Create New"}
                  isPending={isCreating}
                  state="default"
                  type="submit"
                  disabled={isCreating}
                />
              )}
              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={"Save Changes"}
                  isPending={isEditing}
                  state="default"
                  type="submit"
                  disabled={isEditing}
                />
              )}
            </section>
          </header>

          {/* Vendor Details */}
          <section className="vendor-details-section flex grid w-full grid-cols-1 flex-col gap-2 overflow-clip px-3 md:grid-cols-2">
            <Input
              required
              disabled={formState === "display"}
              title="Vendor Name"
              type="str"
              inputValue={newVendorData.vendorName}
              name="vendorName"
              placeholder="Enter vendor name"
              maxLength={50}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, vendorName: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Person"
              type="str"
              inputValue={newVendorData.contactPerson}
              name="contactPerson"
              placeholder="Enter contact person name"
              maxLength={50}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, contactPerson: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Number"
              min={0}
              prefixText="+91"
              max={9999999999}
              type="num"
              inputValue={newVendorData.contactNumber}
              name="contactNumber"
              placeholder="Enter contact number"
              maxLength={10}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, contactNumber: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Email Address"
              inputValue={newVendorData.emailAddress}
              name="emailAddress"
              placeholder="Enter email address"
              maxLength={100}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, emailAddress: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Address Line 1"
              type="str"
              inputValue={newVendorData.addressLine1}
              name="Address Line1"
              placeholder="Enter AddressLine1"
              maxLength={150}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, addressLine1: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Address Line 2"
              type="str"
              inputValue={newVendorData.addressLine2}
              name="Address Line2"
              placeholder="Enter addressLine2"
              maxLength={150}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, addressLine2: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="City"
              type="str"
              inputValue={newVendorData.city}
              name="city"
              placeholder="Enter city"
              maxLength={150}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, city: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="State"
              type="str"
              inputValue={newVendorData.state}
              name="state"
              placeholder="Enter state"
              maxLength={150}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, state: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="PinCode"
              type="str"
              inputValue={
                newVendorData.pinCode === 0 ? "" : newVendorData.pinCode
              }
              onChange={(value) =>
                setNewVendorData({
                  ...newVendorData,
                  pinCode: Number(value) || 0,
                })
              }
              name="PinCode"
              placeholder="Enter PinCode"
              maxLength={6}
            />

            <Input
              disabled={formState === "display"}
              title="GST Number"
              type="str"
              inputValue={newVendorData.gstNumber}
              name="gstNumber"
              placeholder="Enter GST number"
              maxLength={15}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, gstNumber: value })
              }
            />
          </section>
          {/* <div className="px-3">
            <TextArea
              title="Remarks"
              name="Remarks"
              placeholder="Remarks"
              disabled={formState === "display"}
              inputValue={newVendorData.remarks}
              onChange={(value) =>
                setNewVendorData({ ...newVendorData, remarks: value })
              }
            />
          </div> */}
        </form>
      </div>
    </main>
  );
};

export default VendorEdit;
