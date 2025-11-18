import { useState } from "react";
import { useImportMachines } from "../../../queries/TranscationQueries/MachineQuery";
import { useDownloadTemplate } from "../../../queries/TranscationQueries/MachineQuery";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MachineImportModal = ({ isOpen, onClose }: ImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: importMachines, isPending } = useImportMachines();
  const { data, refetch } = useDownloadTemplate();
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImportSubmit = () => {
    if (selectedFile) {
      importMachines(selectedFile, {
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
      await refetch(); 
      if (data) {
        const contentDisposition = "attachment; filename=MachineEntry.xlsx"; 
        let filename = "MachineEntry-template.xlsx";
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-black/30"></div>
      <div className="relative z-50 bg-white shadow-2xl rounded-2xl p-6 w-[500px] max-w-[90%] transform transition-all duration-300 hover:shadow-3xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">Upload MachineEntry Data</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-gray-300 cursor-pointer rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              accept=".xlsx, .xls"
            />
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition duration-200 cursor-pointer disabled:opacity-50"
              onClick={handleImportSubmit}
              disabled={!selectedFile || isPending}
            >
              {isPending ? "Importing..." : "Import"}
            </button>
          </div>
          <p className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "No file chosen"}</p>
          <div>
            <h3 className="text-md font-semibold text-blue-600 mb-2">Notes:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Don't change heading.</li> 
                 <li>Mandatory master fields: ClientName, MachineType, MachineModel,	Machine Serial </li>
              <li>Mandatory fields: Reference Number,Reference Date, Installation Date,Installedby</li>        
              <li>Date Format Must Be DD.MM.YYYY</li>
            </ol>
          </div>
          <div className="flex justify-between gap-3">
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white  px-4 py-2 rounded-lg  transition cursor-pointer duration-200"
              onClick={handleDownloadSampleTemplate}
            >
              Sample Template
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white  px-4 py-2 rounded-lg transition cursor-pointer duration-200"
              onClick={() => console.log("Download Data")}
            >
              Download Data
            </button>
          </div>
          <button
            className="mt-4 bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer duration-200 w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineImportModal;