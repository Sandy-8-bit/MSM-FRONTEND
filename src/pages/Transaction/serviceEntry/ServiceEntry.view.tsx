import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect from "@/components/common/DropDown";
import type { ServiceEntryData } from "@/types/transactionTypes";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import { convertToFrontendDate } from "@/utils/commonUtils";

interface ServiceEntryDisplayProps {
  data: ServiceEntryData;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ServiceEntryDisplay: React.FC<ServiceEntryDisplayProps> = ({
  data,
  setIsDialogOpen,
}) => {
  // Parse machine details (format: "SINGLE NEEDLE - JUKI - DDL7000 - DDM3423")
  const machineDetailsParts = data.machineDetails.split(" - ");
  const machineType = machineDetailsParts[0] || "";
  const brand = machineDetailsParts[1] || "";
  const model = machineDetailsParts[2] || "";
  const serialNumber = machineDetailsParts[3] || "";

  return (
    <div className="flex min-w-full flex-col overflow-scroll rounded-lg">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="mb-4 text-xl font-semibold">Service Entry Details</h2>

        <ButtonSm
          className="items-center justify-center bg-blue-500 text-center text-white hover:bg-blue-700 active:bg-blue-500"
          state="default"
          text={"Close"}
          onClick={() => setIsDialogOpen(false)}
          type="submit"
        />
      </div>
      <div className="grid max-h-[500px] min-w-full grid-cols-1 flex-col items-start gap-4 overflow-scroll md:grid-cols-2">
        <Input
          title="Reference No"
          name="referenceNo"
          disabled={true}
          inputValue={data.refNumber}
          onChange={() => {}}
        />

        <DateInput
          title="Service Date"
          disabled={true}
          value={convertToFrontendDate(data.serviceDate || "")}
          onChange={() => {}}
          required
        />

        <DropdownSelect
          title="Client Name"
          disabled={true}
          options={[]}
          selected={{ id: 0, label: data.clientName }}
          onChange={() => {}}
          required
        />

        <DropdownSelect
          title="Service Request Reference"
          disabled={true}
          options={[]}
          selected={{ id: 0, label: data.serviceRequestRef }}
          onChange={() => {}}
        />

        <div className="flex w-full flex-col gap-3 md:flex-row">
          <DropdownSelect
            required
            className="w-full"
            title="Maintenance Type"
            disabled={true}
            options={[]}
            selected={{ id: 0, label: data.maintenanceType }}
            onChange={() => {}}
          />

          {data.maintenanceSubType && (
            <DropdownSelect
              title="Non-warranty Type"
              className="w-full"
              disabled={true}
              options={[]}
              selected={{ id: 0, label: data.maintenanceSubType }}
              onChange={() => {}}
            />
          )}
        </div>

        <DropdownSelect
          required
          title="Vendor Name"
          options={[]}
          disabled={true}
          selected={{ id: 0, label: data.vendorName }}
          onChange={() => {}}
        />

        <div className="flex w-full flex-col gap-3 md:flex-row">
          <DropdownSelect
            required
            title="Engineer Name"
            className="w-full"
            disabled={true}
            options={[]}
            selected={{ id: 0, label: data.engineerName }}
            onChange={() => {}}
          />

          <Input
            title="Engineer Mobile"
            name="engineerMobile"
            className="w-full"
            disabled={true}
            inputValue={data.engineerMobile}
            onChange={() => {}}
          />
        </div>

        <div className="machine-details grid w-full grid-cols-3 gap-2">
          <DropdownSelect
            title="Machine Brand"
            options={[]}
            disabled={true}
            selected={{ id: 0, label: brand }}
            onChange={() => {}}
          />

          <DropdownSelect
            title="Machine Type"
            options={[]}
            disabled={true}
            selected={{ id: 0, label: machineType }}
            onChange={() => {}}
          />

          <DropdownSelect
            title="Machine Model"
            options={[]}
            disabled={true}
            selected={{ id: 0, label: model }}
            onChange={() => {}}
          />
        </div>

        <DropdownSelect
          title="Machine Serial Number"
          disabled={true}
          options={[]}
          selected={{ id: 0, label: serialNumber }}
          onChange={() => {}}
        />

        <Input
          title="Remarks"
          name="remarks"
          disabled={true}
          inputValue={data.remarks}
          onChange={() => {}}
        />

        <Input
          required
          title="Engineer Diagnostics"
          name="engineerDiagnostics"
          className="min-h-full"
          disabled={true}
          inputValue={data.engineerDiagnostics}
          onChange={() => {}}
        />

        <DropdownSelect
          required
          title="Service Status"
          direction="down"
          disabled={true}
          options={[]}
          selected={{ id: 0, label: data.serviceStatus }}
          onChange={() => {}}
        />

        {/* Spare Parts Section */}
        {data.spareParts && data.spareParts.length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="mb-3 text-lg font-medium">Spare Parts Used</h3>
            <div className="flex flex-col gap-2 space-y-4">
              {data.spareParts.map((spare, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      title="Spare Name"
                      name={`spareName-${index}`}
                      disabled={true}
                      inputValue={spare.spareName}
                      onChange={() => {}}
                    />

                    <Input
                      title="Part Number"
                      name={`partNumber-${index}`}
                      disabled={true}
                      inputValue={spare.partNumber}
                      onChange={() => {}}
                    />

                    <Input
                      title="Quantity"
                      name={`quantity-${index}`}
                      disabled={true}
                      inputValue={spare.quantity.toString()}
                      onChange={() => {}}
                    />
                  </div>

                  {/* Photo URLs section - only show if photos exist */}
                  {(spare.sparePhotoUrl || spare.complaintSparePhotoUrl) && (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {spare.sparePhotoUrl && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Spare Photo
                          </label>

                          <div className="rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-600">
                            Photo available
                            <img src={spare.sparePhotoUrl} alt="spare-photo" />
                          </div>
                        </div>
                      )}

                      {spare.complaintSparePhotoUrl && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Complaint Spare Photo
                          </label>
                          <div className="rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-600">
                            Photo available
                            <img
                              src={spare.complaintSparePhotoUrl}
                              alt="complaint-spare-photo"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceEntryDisplay;
