import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { ClientDetails } from "../../../types/masterApiTypes";
import {
  useCreateClient,
  useEditClient,
} from "../../../queries/masterQueries/ClientQuery";

const ClientEdit = ({
  clientDetails,
  formState,
  setFormState,
  setClient,
}: {
  clientDetails: ClientDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setClient: React.Dispatch<React.SetStateAction<ClientDetails>>;
}) => {
  const [clientData, setClientData] = useState<ClientDetails | null>(null);

  const { mutate: createClient, isPending, isSuccess } = useCreateClient();

  const {
    mutate: updateClient,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditClient();

  const resetData: ClientDetails = {
    id: 0,
    clientName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pinCode: 0,
    state: "",
    gstNumber: "",
    remarks: "",
  };

  const disableButton =
    clientDetails?.clientName === clientData?.clientName &&
    clientDetails?.contactNumber === clientData?.contactNumber &&
    clientDetails?.contactPerson === clientData?.contactPerson &&
    clientDetails?.email === clientData?.email &&
    clientDetails?.addressLine1 === clientData?.addressLine1 &&
    clientDetails?.addressLine2 === clientData?.addressLine2 &&
    clientDetails?.city === clientData?.city &&
    clientDetails?.pinCode === clientData?.pinCode &&
    clientDetails?.state === clientData?.state &&
    clientDetails?.gstNumber === clientData?.gstNumber;

  useEffect(() => {
    if (formState === "create") {
      setClientData(resetData);
    } else if (clientDetails) {
      setClientData(clientDetails);
    }
  }, [clientDetails, formState]);

  useEffect(() => {
    if (isSuccess) {
      setFormState("create");
      setClient(resetData);
      setClientData(resetData);
    } else if (isUpdatingSuccess && clientData) {
      setFormState("create");
      setClient(clientData);
    }
  }, [isSuccess, isUpdatingSuccess]);

  const handleCancel = () => {
    setFormState("create");
    setClient(resetData);
    setClientData(resetData);
  };

  if (!clientData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a client to view details.
      </p>
    );
  }

const hasData =
  !!clientData.clientName ||
  !!clientData.contactPerson ||
  !!clientData.contactNumber ||
  !!clientData.email ||
  !!clientData.addressLine1 ||
  !!clientData.addressLine2 ||
  !!clientData.city ||
  !!clientData.pinCode ||
  !!clientData.state ||
  !!clientData.gstNumber;


  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="client-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState === "create" && clientData) {
              createClient(clientData);
            }
          }}
        >
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Client Configuration"
                : `${clientDetails?.clientName} Configuration`}
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

              {formState === "display" && clientData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}

              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={"Create New"}
                  isPending={isPending}
                  state="default"
                  type="submit"
                  disabled={isPending}
                />
              )}

              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-60"
                  text={"Save Changes"}
                  isPending={isUpdatePending}
                  state="default"
                  type="button"
                  disabled={disableButton || isUpdatePending}
                  onClick={() => {
                    if (clientData) {
                      updateClient(clientData);
                    }
                  }}
                />
              )}
            </section>
          </header>

          {/* Form Fields */}
          <section className="flex w-full flex-col gap-2 overflow-clip px-3 md:grid md:grid-cols-2">
            <Input
              required
              disabled={formState === "display"}
              title="Client Name"
              type="str"
              inputValue={clientData.clientName}
              name="clientName"
              placeholder="Enter client name"
              maxLength={50}
              onChange={(value) =>
                setClientData({ ...clientData, clientName: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Person"
              type="str"
              inputValue={clientData.contactPerson}
              name="contactPerson"
              placeholder="Enter contact person"
              maxLength={50}
              onChange={(value) =>
                setClientData({ ...clientData, contactPerson: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Number"
              type="num"
              prefixText="+91"
              inputValue={clientData.contactNumber}
              name="contactNumber"
              placeholder="Enter contact number"
              maxLength={9999999999}
              onChange={(value) =>
                setClientData({ ...clientData, contactNumber: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Email"
              inputValue={clientData.email}
              name="email"
              placeholder="Enter email"
              onChange={(value) =>
                setClientData({ ...clientData, email: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Address Line 1"
              inputValue={clientData.addressLine1}
              name="addressLine1"
              maxLength={100}
              placeholder="Enter Address line 1"
              onChange={(value) =>
                setClientData({ ...clientData, addressLine1: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Address Line 2"
              inputValue={clientData.addressLine2}
              name="addressLine2"
              placeholder="Enter Address line 2"
              maxLength={100}
              onChange={(value) =>
                setClientData({ ...clientData, addressLine2: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="City"
              inputValue={clientData.city}
              name="city"
              placeholder="Enter city"
              onChange={(value) =>
                setClientData({ ...clientData, city: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Pin Code"
              type="str" // change from "num" to "str"
              maxLength={6}
              inputValue={
                clientData.pinCode === 0 ? "" : clientData.pinCode.toString()
              }
              onChange={(value) =>
                setClientData({
                  ...clientData,
                  pinCode: /^\d*$/.test(value)
                    ? Number(value)
                    : clientData.pinCode,
                })
              }
              name="pinCode"
              placeholder="Enter pin code"
            />

            <Input
              disabled={formState === "display"}
              title="State"
              inputValue={clientData.state}
              name="state"
              placeholder="Enter state"
              onChange={(value) =>
                setClientData({ ...clientData, state: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="GST Number"
              type="str"
              inputValue={clientData.gstNumber}
              name="gstNumber"
              placeholder="Enter GST number"
              maxLength={15}
              onChange={(value) =>
                setClientData({ ...clientData, gstNumber: value })
              }
            />
          </section>
          {/* <div className="px-3">
            <TextArea
              title="Remarks"
              name="Remarks"
              placeholder="Remarks"
              disabled={formState === "display"}
              inputValue={clientData.remarks}
              onChange={(value) =>
                setClientData({ ...clientData, remarks: value })
              }
            />
          </div> */}
        </form>
      </div>
    </main>
  );
};

export default ClientEdit;
