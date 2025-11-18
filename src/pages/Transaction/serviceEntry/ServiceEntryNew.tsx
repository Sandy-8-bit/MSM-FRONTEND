import { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { ServiceEntryPayload } from "@/types/transactionTypes";
import { useFetchServiceEngineerOptions } from "@/queries/masterQueries/ServiceEngineersQuery";
import { useCreateServiceEntry } from "@/queries/TranscationQueries/ServiceEntryQuery";
import {
  convertToBackendDate,
  generateReferenceNumber,
  getMaxDateFromToday,
  getMinDateFromToday,
} from "@/utils/commonUtils";
import { useFetchVendorOptions } from "@/queries/masterQueries/VendorQuery";
import {
  maintenanceOptions,
  maintenanceSubtTypeOptions,
  statusOptions,
} from "@/utils/uiUtils";
import MultiSelectDropdown from "@/components/common/MultiSelectDropDown";
import { useFetchSparesOptions } from "@/queries/masterQueries/SpareQuery";
import RequestEntrySkeleton from "./ServiceEntryFormSkeleton";
import SparePartsManager from "./SparesImageUploader.component";

interface SparePartData {
  spareId: number;
  quantity: number;
  complaintSparePhotoUrl?: File;
  sparePhotoUrl?: File;
}

// Import real client options from API
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import type { FormState } from "@/types/appTypes";

import {
  useFetchMachineOptions,
  useFetchMachineDropdownOptions,
} from "@/queries/TranscationQueries/MachineQuery";
import {
  useFetchProductsType,
  useFetchProductDropdownOptions,
} from "@/queries/masterQueries/ProductQuery";
import { useFetchProblemOptions } from "@/queries/masterQueries/Problem-types";
import PageHeader from "@/components/masterPage.components/PageHeader";
import QrScannerDialog from "../serviceRequest/QrScannerDialog";

const ServiceEntryNew = () => {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const emptyData: ServiceEntryPayload = {
    refNumber: generateReferenceNumber("Ref"),
    serviceDate: getCurrentDate(),
    maintenanceType: "",
    maintenanceSubType: "",
    serviceRequestId: 0,
    vendorId: 0,
    engineerId: 0,
    engineerDiagnostics: "",
    serviceStatus: "",
    remarks: "",
    complaintSparePhotoUrl: "",
    // complaintDetailsId: 0,
    spareParts: [],
  };

  const [searchParams] = useSearchParams();

  // ---------- states ----------
  const modeParam = searchParams.get("mode") as FormState;
  const [formState, setFormState] = useState<FormState>("create");
  const [formData, setFormData] = useState<ServiceEntryPayload>(emptyData);
  const [sparePartsData, setSparePartsData] = useState<SparePartData[]>([]);
  const [selectedSpares, setSelectedSpares] = useState<DropdownOption[]>([]);
  const [spareQuantities, setSpareQuantities] = useState<{
    [key: number]: number;
  }>({});

  const [showQRDialog, setShowQRDialog] = useState(false);
  const defaultOption: DropdownOption = { id: 0, label: "Select" };
  // Machine dropdown states
  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedComplaint, setSelectedComplaint] = useState<DropdownOption>({
    id: 0,
    label: "Select Complaint Type",
  });
  const [selectedType, setSelectedType] =
    useState<DropdownOption>(defaultOption);
  const [selectedBrand, setSelectedBrand] =
    useState<DropdownOption>(defaultOption);
  const [selectedModel, setSelectedModel] =
    useState<DropdownOption>(defaultOption);
  const [selectedSerial, setSelectedSerial] =
    useState<DropdownOption>(defaultOption);

  // Machine dropdown options from API
  const { data: typeOptions = [] } = useFetchProductsType();
  const { data: brandOptions = [] } = useFetchProductDropdownOptions({
    level: "brands",
    type: selectedType?.label || "",
  });
  const { data: modelOptions = [] } = useFetchProductDropdownOptions({
    level: "models",
    type: selectedType?.label || "",
    brand: selectedBrand?.label || "",
  });
  const { data: serialOptions = [] } = useFetchMachineDropdownOptions({
    level: "serials",
    type: selectedType?.label || "",
    brand: selectedBrand?.label || "",
    model: selectedModel?.label || "",
  });

  const { data: complaint = [], isLoading: isComplaintLoading } =
    useFetchProblemOptions();

  const { data: engineerOptions = [], isLoading: isEngineerOptionsLoading } =
    useFetchServiceEngineerOptions();

  const { data: vendorOptions = [], isLoading: isVendorLoading } =
    useFetchVendorOptions();

  const { data: sparesOptions = [], isLoading: isSparesLoading } =
    useFetchSparesOptions();

  const { data: clientOptions = [], isLoading: isClientOptionsLoading } =
    useFetchClientOptions();

  const {
    mutateAsync: createServiceEntry,
    isPending: isCreateServiceEntryPending,
  } = useCreateServiceEntry();

  // ---------- use effects ----------
  useEffect(() => {
    if (modeParam) {
      setFormState(modeParam);
    }
  }, [modeParam]);

  const parseQRData = (data: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const keyMap: Record<string, string> = {
      MACHINE_ENTRY_ID: "machineEntryId",
      "SERIAL #": "serialNumber",
      "REF #": "referenceNumber",
      CLIENT: "clientName",
      TYPE: "machineType",
      BRAND: "brand",
      MODEL: "modelNumber",
      INSTALLED: "installationDate",
    };

    const regex = /([A-Z_ #]+)[\s:=]+([^:\n\r]+)/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const rawKey = match[1].trim().toUpperCase();
      const value = match[2].trim();
      const normalizedKey = keyMap[rawKey] ?? rawKey.toLowerCase();
      result[normalizedKey] = value;
    }

    return result;
  };

  const handleQRScan = (data: string) => {
    const parsed = parseQRData(data);
    const entryId = parsed.machineEntryId;
    const clientName = parsed.clientName;

    const matchedClient = clientOptions.find(
      (client) => client.label.toLowerCase() === clientName?.toLowerCase(),
    );

    setSelectedClient({
      id: matchedClient?.id || 0,
      label: clientName || "",
    });

    if (!entryId) {
      toast.error("Missing machineEntryId");
      return;
    }

    setSelectedType({ id: 404, label: parsed.machineType || "" });
    setSelectedBrand({ id: 404, label: parsed.brand || "" });
    setSelectedModel({ id: 404, label: parsed.modelNumber || "" });
    setSelectedSerial({ id: 404, label: parsed.serialNumber || "" });

    setFormData((prev) => ({
      ...prev,
      clientId: matchedClient?.id || 0,
      machineEntryId: Number(entryId),
    }));

    setShowQRDialog(false);
  };

  // Update spare quantities
  const updateSpareQuantity = (spareId: number, quantity: number) => {
    setSpareQuantities((prev) => ({
      ...prev,
      [spareId]: Math.max(1, quantity),
    }));
  };

  // Handle spare selection changes
  const handleSparesChange = (newSpares: DropdownOption[]) => {
    const newSpareIds = new Set(newSpares.map((spare) => spare.id));

    setSelectedSpares(newSpares);

    // Clean up removed quantities
    setSpareQuantities((prev) => {
      const cleaned = { ...prev };
      Object.keys(cleaned).forEach((spareIdStr) => {
        const spareId = parseInt(spareIdStr);
        if (!newSpareIds.has(spareId)) {
          delete cleaned[spareId];
        }
      });
      return cleaned;
    });

    // Clean up removed spare parts data
    setSparePartsData((prev) =>
      prev.filter((spare) => newSpareIds.has(spare.spareId)),
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for file uploads
    const formDataToSend = new FormData();

    // Add basic form fields
    formDataToSend.append("refNumber", formData.refNumber);
    formDataToSend.append(
      "serviceDate",
      convertToBackendDate(formData.serviceDate),
    );
    formDataToSend.append("maintenanceType", formData.maintenanceType);
    formDataToSend.append("maintenanceSubType", formData.maintenanceSubType);
    formDataToSend.append(
      "serviceRequestId",
      formData.serviceRequestId.toString(),
    );
    formDataToSend.append("vendorId", formData.vendorId.toString());
    formDataToSend.append("engineerId", formData.engineerId.toString());
    if (selectedComplaint && selectedComplaint.id !== 0) {
      formDataToSend.append(
        "complaintDetailsId",
        selectedComplaint.id.toString(),
      );
    }
    formDataToSend.append("engineerDiagnostics", formData.engineerDiagnostics);
    formDataToSend.append("serviceStatus", formData.serviceStatus);
    formDataToSend.append("remarks", formData.remarks);

    // Add spare parts data with proper file handling
    sparePartsData.forEach((spare, index) => {
      formDataToSend.append(
        `spareParts[${index}][spareId]`,
        spare.spareId.toString(),
      );
      formDataToSend.append(
        `spareParts[${index}][quantity]`,
        spare.quantity.toString(),
      );

      // Add files with correct field names and null checks
      if (spare.complaintSparePhotoUrl instanceof File) {
        formDataToSend.append(
          `spareParts[${index}][complaintSparePhotoUrl]`,
          spare.complaintSparePhotoUrl,
          spare.complaintSparePhotoUrl.name,
        );
      }

      if (spare.sparePhotoUrl instanceof File) {
        formDataToSend.append(
          `spareParts[${index}][sparePhotoUrl]`,
          spare.sparePhotoUrl,
          spare.sparePhotoUrl.name,
        );
      }
    });

    try {
      await createServiceEntry(formDataToSend);
      toast.success("Service entry created successfully!");
    } catch (error) {
      toast.error("Failed to create service entry");
      console.error(error);
    }
  };

  if (
    isEngineerOptionsLoading ||
    isVendorLoading ||
    isSparesLoading ||
    isClientOptionsLoading ||
    isComplaintLoading
  )
    return <RequestEntrySkeleton />;

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md md:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <PageHeader title="New Service Entry" />
        <ButtonSm
          type="button"
          text="Scan QR"
          state="default"
          className="mb-4 w-fit border-blue-400 text-white"
          onClick={() => {
            setShowQRDialog(true);
            console.log("clciked");
          }}
        />
      </div>

      <QrScannerDialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        onScan={handleQRScan}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-4 md:grid-cols-2"
      >
        <Input
          title="Reference No"
          name="referenceNo"
          disabled
          inputValue={formData.refNumber}
          onChange={(val) => {
            setFormData({ ...formData, refNumber: val });
          }}
          required
        />

        <DateInput
          title="Service Date"
          value={formData.serviceDate}
          onChange={(val) => {
            setFormData({ ...formData, serviceDate: val });
          }}
          minDate={getMinDateFromToday(3)}
          maxDate={getMaxDateFromToday(3)}
          required
        />

        <DropdownSelect
          title="Client Name"
          options={clientOptions}
          selected={selectedClient}
          onChange={(val) => {
            setSelectedClient(val);
            setFormData((prev) => ({
              ...prev,
              clientId: val.id,
            }));
          }}
          required
        />

        <div className="flex w-full flex-col gap-3 md:flex-row">
          <DropdownSelect
            required
            className="w-full"
            title="Maintenance Type"
            options={maintenanceOptions}
            selected={
              maintenanceOptions.find(
                (m) => m.label === formData.maintenanceType,
              ) || { id: 0, label: "Select Maintenance Type" }
            }
            onChange={(val) =>
              setFormData({ ...formData, maintenanceType: val.label })
            }
          />

          {formData.maintenanceType === "Non-Warranty" && (
            <DropdownSelect
              required={formData.maintenanceType === "Non-Warranty"}
              title="Non-warranty Type"
              className="w-full"
              options={maintenanceSubtTypeOptions}
              selected={
                maintenanceSubtTypeOptions.find(
                  (m) => m.label === formData.maintenanceSubType,
                ) || { id: 0, label: "Select Non-warranty Type" }
              }
              onChange={(val) =>
                setFormData({ ...formData, maintenanceSubType: val.label })
              }
            />
          )}
          {formData.maintenanceType === "General" && (
            <Input
              required
              disabled
              className="w-full"
              title="Scope"
              inputValue="Thugil Scope"
              onChange={() => {}}
            />
          )}
          {formData.maintenanceType === "Breakdown" && (
            <Input
              required
              disabled
              className="w-full"
              title="Scope"
              inputValue="Client Scope"
              onChange={() => {}}
            />
          )}
        </div>

        <DropdownSelect
          title="Complaint"
          options={complaint}
          selected={selectedComplaint}
          onChange={(val) => {
            setSelectedComplaint(val);
            setFormData((prev) => ({
              ...prev,
              complaintDetailsId: val.id,
            }));
          }}
          required
        />

        <DropdownSelect
          required
          title="Vendor Name"
          options={vendorOptions}
          selected={
            vendorOptions.find((m) => m.id === formData.vendorId) || {
              id: 0,
              label: "Select Vendor",
            }
          }
          onChange={(val) => setFormData({ ...formData, vendorId: val.id })}
        />

        <DropdownSelect
          required
          title="Engineer Name"
          options={engineerOptions}
          selected={
            engineerOptions.find((opt) => opt.id === formData.engineerId) || {
              id: 0,
              label: "Select Engineer",
            }
          }
          onChange={(val) => setFormData({ ...formData, engineerId: val.id })}
        />

        <DropdownSelect
          title="Machine Type"
          options={typeOptions}
          selected={selectedType}
          onChange={(val) => {
            setSelectedType(val);
            setSelectedBrand(defaultOption);
            setSelectedModel(defaultOption);
            setSelectedSerial(defaultOption);
          }}
          required
        />

        <DropdownSelect
          title="Machine Brand"
          options={brandOptions}
          selected={selectedBrand}
          onChange={(val) => {
            setSelectedBrand(val);
            setSelectedModel(defaultOption);
            setSelectedSerial(defaultOption);
          }}
          className={`${selectedType?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
          disabled={!selectedType}
          required
        />

        <DropdownSelect
          title="Machine Model"
          options={modelOptions}
          selected={selectedModel}
          onChange={(val) => {
            setSelectedModel(val);
            setSelectedSerial(defaultOption);
          }}
          className={`${selectedBrand?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
          disabled={!selectedBrand}
          required
        />

        <DropdownSelect
          title="Machine Serial Number"
          options={serialOptions}
          selected={selectedSerial}
          onChange={(val) => {
            setSelectedSerial(val);
            setFormData((prev) => ({
              ...prev,
              machineEntryId: val.id,
            }));
          }}
          className={`${selectedModel?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
          disabled={!selectedModel}
          required
        />

        <Input
          required
          title="Engineer Diagnostics"
          name="engineerDiagnostics"
          className="min-h-full"
          inputValue={formData.engineerDiagnostics}
          onChange={(val) =>
            setFormData({ ...formData, engineerDiagnostics: val })
          }
          placeholder="Enter diagnosis"
        />

        <MultiSelectDropdown
          title="Spares"
          options={sparesOptions}
          selectedOptions={selectedSpares}
          onChange={handleSparesChange}
          placeholder="Select spares to add"
          required={false}
        />

        <SparePartsManager
          selectedSpares={selectedSpares}
          spareQuantities={spareQuantities}
          updateSpareQuantity={updateSpareQuantity}
          onSpareDataChange={setSparePartsData}
          latestSpareId={null}
        />

        <DropdownSelect
          required
          title="Service Status"
          direction="down"
          options={statusOptions}
          selected={
            statusOptions.find((m) => m.label === formData.serviceStatus) ?? {
              id: 0,
              label: "Select Status",
            }
          }
          onChange={(val) =>
            setFormData({ ...formData, serviceStatus: val.label })
          }
        />

        <Input
          title="Remarks"
          name="RequestEntryRemarks"
          placeholder="Eg: Completed within the scheduled time frame."
          inputValue={formData.remarks}
          onChange={(val) => setFormData({ ...formData, remarks: val })}
        />

        <div className="col-span-1 mt-4 flex justify-end md:col-span-2">
          <ButtonSm
            isPending={isCreateServiceEntryPending}
            type="submit"
            text="Submit"
            state="default"
            className="text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default ServiceEntryNew;
