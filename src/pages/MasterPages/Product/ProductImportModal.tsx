import { useState } from "react";
import { useImportProduct } from "../../../queries/masterQueries/ProductQuery";
import { useDownloadTemplate } from "../../../queries/masterQueries/ProductQuery";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductImportModal = ({ isOpen, onClose }: ImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: importProduct, isPending } = useImportProduct();
  const { data, refetch } = useDownloadTemplate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImportSubmit = () => {
    if (selectedFile) {
      importProduct(selectedFile, {
        onSuccess: () => {
          setSelectedFile(null);
          onClose();
        },
        onError: (error) => {
          console.error("Import error:", error);
        },
      });
    }
  };

  const handleDownloadSampleTemplate = async () => {
    try {
      console.log("buttonclicked")
      await refetch(); // Trigger the query to fetch the template
      if (data) {
        const contentDisposition =
          "attachment; filename=productMaster-template.xlsx"; // Match backend header
        let filename = "productMaster-template.xlsx";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading sample template:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm backdrop-filter"></div>
      <div className="hover:shadow-3xl relative z-50 w-[500px] max-w-[90%] transform rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-300">
        <h2 className="mb-5 border-b pb-2 text-xl font-bold text-gray-800">
          Upload Product Data
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full cursor-pointer rounded-lg border border-gray-300 p-2 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
              accept=".xlsx, .xls"
            />
            <button
              className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 text-white transition duration-200 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 disabled:opacity-50"
              onClick={handleImportSubmit}
              disabled={!selectedFile || isPending}
            >
              {isPending ? "Importing..." : "Import"}
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </p>
          <div>
            <h3 className="text-md mb-2 font-semibold text-blue-600">Notes:</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
              <li>Don't change heading.</li>
              <li>Mandatory master fields: MachineType, Brand, ModelNumber</li>
              <li>Date Format Must Be DD.MM.YYYY</li>
            </ol>
          </div>
          <div className="flex justify-between gap-3">
            <button
              className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition duration-200"
              onClick={handleDownloadSampleTemplate}
            >
              Sample Template
            </button>
            <button
              className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition duration-200"
              onClick={() => console.log("Download Data")}
            >
              Download Data
            </button>
          </div>
          <button
            className="mt-4 w-full cursor-pointer rounded-lg bg-gray-100 px-6 py-2 text-gray-800 transition duration-200 hover:bg-gray-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImportModal;
