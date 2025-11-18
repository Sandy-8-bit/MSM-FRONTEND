import React, { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { toast } from "react-toastify";
import {
  useFetchMachineDropdownOptions,
  useFetchMachineOptions,
} from "@/queries/TranscationQueries/MachineQuery";
import { useCreateServiceRequest } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useFetchProblemOptions } from "@/queries/masterQueries/Problem-types";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import {
  convertToFrontendDate,
  convertToBackendDate,
} from "@/utils/commonUtils";
import type { ServiceRequest } from "@/types/transactionTypes";
import QrScannerDialog from "./QrScannerDialog";

type Mode = "create" | "edit" | "display";

interface Props {
  mode: Mode;
  requestFromParent: ServiceRequest;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ServiceRequestFormPage: React.FC<Props> = ({
  mode,
  requestFromParent,
  setFormVisible,
}) => {
  const isView = mode === "display";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const [machineEntryId, setMachineEntryId] = useState<number | null>(null);
  const [complaintDetailsId, setComplaintDetailsId] = useState<number | null>(
    null,
  );
  const [showQRDialog, setShowQRDialog] = useState(false);

  const { mutateAsync: createServiceRequest, isPending } =
    useCreateServiceRequest();

  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: complaintOptions = [] } = useFetchProblemOptions();
  const { data: machineOptions = [] } = useFetchMachineOptions();

  const [request, setRequest] = useState<ServiceRequest>(requestFromParent);
  const [selectedComplaint, setSelectedComplaint] = useState<DropdownOption>({
    id: 0,
    label: "Select Complaint",
  });

  const defaultOption: DropdownOption = { id: 0, label: "Select" };
  const [selectedType, setSelectedType] =
    useState<DropdownOption>(defaultOption);
  const [selectedBrand, setSelectedBrand] =
    useState<DropdownOption>(defaultOption);
  const [selectedModel, setSelectedModel] =
    useState<DropdownOption>(defaultOption);
  const [selectedSerial, setSelectedSerial] =
    useState<DropdownOption>(defaultOption);
  const [selectedClient, setSelectedClient] =
    useState<DropdownOption>(defaultOption);

  const { data: brandOptions = [] } = useFetchMachineDropdownOptions({
    level: "brands",
    type: selectedType?.label || "",
  });

  const { data: modelOptions = [] } = useFetchMachineDropdownOptions({
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

  useEffect(() => {
    if (isCreate) {
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const generatedRef = `SR-${randomPart}`;
      const today = new Date().toLocaleDateString("en-GB").split("/").join("-");

      setRequest((prev) => ({
        ...prev,
        referenceNumber: generatedRef,
        requestDate: today,
      }));
    }
  }, [mode]);

  useEffect(() => {
    if ((isEdit || isView) && requestFromParent) {
      setRequest(requestFromParent);
      setMachineEntryId(requestFromParent.id || null);

      const foundComplaint = complaintOptions.find(
        (opt) => opt.label === requestFromParent.complaintDetails,
      );
      if (foundComplaint) {
        setSelectedComplaint(foundComplaint);
        setComplaintDetailsId(foundComplaint.id);
      }
    }
  }, [requestFromParent, complaintOptions]);

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

  const handleQRProcess = (data: string) => {
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
      toast.error(" missing machineEntryId");
      return;
    }

    setMachineEntryId(Number(entryId));
    setSelectedBrand({ id: 404, label: parsed.brand || "" });
    setSelectedModel({ id: 404, label: parsed.modelNumber || "" });
    setSelectedType({ id: 404, label: parsed.machineType || "" });
    setSelectedSerial({ id: 404, label: parsed.serialNumber || "" });

    setRequest((prev) => ({
      ...prev,
      clientName: parsed.clientName || prev.clientName,
      machineType: parsed.machineType || prev.machineType,
      brand: parsed.brand || prev.brand,
      modelNumber: parsed.modelNumber || prev.modelNumber,
    }));

    setShowQRDialog(false);
  };

  const updateField = (key: keyof ServiceRequest, value: string) => {
    setRequest((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (
      !machineEntryId ||
      request.referenceNumber.trim() === "" ||
      request.requestDate.trim() === ""
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      referenceNumber: request.referenceNumber,
      requestDate: request.requestDate,
      complaintDetailsId: complaintDetailsId || undefined,
      otherComplaintDetails: request.otherComplaintDetails || "",
      clientId: selectedClient?.id,
      machineEntryId: machineEntryId || 0,
    };

    try {
      if (isEdit) {
        return;
      } else {
        await createServiceRequest(payload);
      }
      setFormVisible(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex max-h-screen min-w-full flex-col rounded-2xl bg-white p-4 md:overflow-visible md:py-0">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-semibold capitalize">
          New Service Request
        </h1>

        {isCreate && (
          <>
            <ButtonSm
              type="button"
              text="Scan QR"
              state="default"
              className="mb-4 w-fit border-blue-400 text-white"
              onClick={() => setShowQRDialog(true)}
            />
            <QrScannerDialog
              open={showQRDialog}
              onClose={() => setShowQRDialog(false)}
              onScan={handleQRProcess}
            />
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex min-w-full flex-col gap-4 overflow-y-auto"
      >
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            title="Reference Number"
            inputValue={request.referenceNumber}
            disabled
            required
            onChange={() => {}}
          />
          <DateInput
            title="Request Date"
            value={convertToFrontendDate(request.requestDate)}
            onChange={(val) =>
              updateField("requestDate", convertToBackendDate(val.toString()))
            }
            disabled={isView}
            required
          />
          <DropdownSelect
            title="Client"
            direction="down"
            options={clientOptions}
            selected={selectedClient}
            onChange={(val) => setSelectedClient(val)}
            disabled={isView}
          />
          <DropdownSelect
            title="Machine Type"
            options={machineOptions}
            selected={selectedType}
            onChange={(val) => {
              setSelectedType(val);
              setSelectedBrand(defaultOption);
              setSelectedModel(defaultOption);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView}
          />
          <DropdownSelect
            title="Brand"
            className={`${selectedType?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
            options={brandOptions}
            selected={selectedBrand}
            onChange={(val) => {
              setSelectedBrand(val);
              setSelectedModel(defaultOption);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView || !selectedType}
          />
          <DropdownSelect
            title="Model"
            options={modelOptions}
            selected={selectedModel}
            className={`${selectedBrand?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
            onChange={(val) => {
              setSelectedModel(val);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView || !selectedBrand}
          />
          <DropdownSelect
            title="Serial Number"
            className={`${selectedModel?.id === 0 ? "pointer-events-none opacity-50" : ""}`}
            options={serialOptions}
            selected={selectedSerial}
            onChange={(val) => {
              setMachineEntryId(val.id);
              setSelectedSerial(val);
            }}
            disabled={isView || !selectedModel}
          />
          <DropdownSelect
            title="Complaint"
            direction="up"
            options={complaintOptions}
            selected={selectedComplaint}
            onChange={(val) => {
              setSelectedComplaint(val);
              setComplaintDetailsId(val.id);
            }}
            disabled={isView}
          />
        </div>

        <div className="mt-4 mb-5 flex justify-end gap-4">
          <ButtonSm
            type="button"
            state="outline"
            className="border-[1.5px] border-slate-300"
            onClick={() => setFormVisible(false)}
            text="Back"
          />
          {!isView && (
            <ButtonSm
              type="submit"
              state="default"
              text={isEdit ? "Save Changes" : "Create Request"}
              isPending={isPending}
              className="bg-blue-500 text-white hover:bg-blue-700"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestFormPage;
