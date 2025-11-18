import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  Plus,
  Minus,
  Package,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

interface DropdownOption {
  id: number;
  label: string;
}

interface SparePartData {
  spareId: number;
  quantity: number;
  complaintSparePhotoUrl?: File;
  sparePhotoUrl?: File;
}

interface SparePartsManagerProps {
  selectedSpares?: DropdownOption[];
  spareQuantities?: { [key: number]: number };
  updateSpareQuantity: (spareId: number, quantity: number) => void;
  onSpareDataChange: (sparePartsData: SparePartData[]) => void;
  latestSpareId?: number | null;
  latestSpareRef?: React.RefObject<HTMLDivElement | null>;
}

const SparePartsManager: React.FC<SparePartsManagerProps> = ({
  selectedSpares = [],
  spareQuantities = {},
  updateSpareQuantity,
  onSpareDataChange,
  latestSpareId,
  latestSpareRef,
}) => {
  const [activeTab, setActiveTab] = useState<"quantities" | "images">(
    "quantities",
  );
  const [spareFiles, setSpareFiles] = useState<{
    [key: string]: { file: File; preview: string };
  }>({});

  // Cleanup preview URLs on unmount only
  useEffect(() => {
    return () => {
      Object.values(spareFiles).forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, []);

  // Update parent whenever files change
  useEffect(() => {
    const sparePartsData = selectedSpares.map((spare) => ({
      spareId: spare.id,
      quantity: spareQuantities[spare.id] || 1,
      complaintSparePhotoUrl: spareFiles[`${spare.id}-complaint`]?.file,
      sparePhotoUrl: spareFiles[`${spare.id}-spare`]?.file,
    }));
    onSpareDataChange(sparePartsData);
  }, [spareFiles, selectedSpares, spareQuantities, onSpareDataChange]);

  const handleFileSelect = (
    spareId: number,
    type: "complaint" | "spare",
    file: File,
  ) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const key = `${spareId}-${type}`;
    const preview = URL.createObjectURL(file);

    // Clean up old preview if exists
    if (spareFiles[key]) {
      URL.revokeObjectURL(spareFiles[key].preview);
    }

    setSpareFiles((prev) => ({
      ...prev,
      [key]: { file, preview },
    }));
  };

  const removeFile = (spareId: number, type: "complaint" | "spare") => {
    const key = `${spareId}-${type}`;

    if (spareFiles[key]) {
      URL.revokeObjectURL(spareFiles[key].preview);
      setSpareFiles((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const ImageUploadCard = ({
    spareId,
    type,
    title,
    icon,
  }: {
    spareId: number;
    type: "complaint" | "spare";
    title: string;
    icon: React.ReactNode;
  }) => {
    const key = `${spareId}-${type}`;
    const fileData = spareFiles[key];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(spareId, type, file);
      }
      e.target.value = ""; // Reset input
    };

    return (
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-slate-600">{title}</span>
        </div>

        {fileData ? (
          <div className="group relative">
            <img
              src={fileData.preview}
              alt={title}
              className="h-24 w-full rounded-lg border-2 border-slate-200 object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(spareId, type)}
              className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-full flex-col rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-1 flex-col items-center justify-center border-b border-slate-200 transition-colors hover:bg-slate-100"
            >
              <Camera size={16} className="mb-1 text-slate-400" />
              <span className="text-xs text-slate-500">Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-1 flex-col items-center justify-center transition-colors hover:bg-slate-100"
            >
              <ImageIcon size={16} className="mb-1 text-slate-400" />
              <span className="text-xs text-slate-500">Gallery</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  };

  if (selectedSpares.length === 0) {
    return (
      <div className="my-3 flex w-full flex-col items-center justify-center py-8 text-center">
        <Package size={48} className="mb-3 text-slate-300" />
        <p className="text-sm text-slate-500">No spare parts selected</p>
        <p className="text-xs text-slate-400">
          Select spare parts to manage quantities and photos
        </p>
      </div>
    );
  }

  return (
    <div className="my-3 flex w-full flex-col space-y-3">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-700">
          Spare Parts Management
        </h4>
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("quantities")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "quantities"
                ? "bg-white text-slate-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Quantities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "images"
                ? "bg-white text-slate-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Photos
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "quantities" && (
        <div className="my-2 grid grid-cols-1 gap-3">
          {selectedSpares.map((spare) => (
            <div
              key={spare.id}
              ref={spare.id === latestSpareId ? latestSpareRef : null}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {spare.label} <span className="text-red-500">*</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSpareQuantity(
                      spare.id,
                      Math.max(1, (spareQuantities[spare.id] || 1) - 1),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={(spareQuantities[spare.id] || 1) <= 1}
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min="1"
                  max="999"
                  value={spareQuantities[spare.id] || 1}
                  onChange={(e) =>
                    updateSpareQuantity(
                      spare.id,
                      Math.max(1, Math.min(999, parseInt(e.target.value) || 1)),
                    )
                  }
                  className="w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    updateSpareQuantity(
                      spare.id,
                      Math.min(999, (spareQuantities[spare.id] || 1) + 1),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={(spareQuantities[spare.id] || 1) >= 999}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "images" && (
        <div className="my-2 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {selectedSpares.map((spare) => (
            <div
              key={spare.id}
              className="w-full rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {spare.label}
                </h3>
                <span className="text-xs text-slate-500">
                  (Qty: {spareQuantities[spare.id] || 1})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImageUploadCard
                  spareId={spare.id}
                  type="complaint"
                  title="Problem Spare"
                  icon={<AlertCircle size={14} className="text-red-500" />}
                />
                <ImageUploadCard
                  spareId={spare.id}
                  type="spare"
                  title="Replacement Spare"
                  icon={<Camera size={14} className="text-green-500" />}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Summary */}
      <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-blue-700">
            {selectedSpares.length} spare part
            {selectedSpares.length !== 1 ? "s" : ""} selected
          </span>
          <span className="text-blue-600">
            {Object.keys(spareFiles).length} photo
            {Object.keys(spareFiles).length !== 1 ? "s" : ""} uploaded
          </span>
        </div>
      </div>
    </div>
  );
};

export default SparePartsManager;
