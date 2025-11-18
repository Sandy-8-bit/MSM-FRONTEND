// components/common/QrScannerDialog.tsx
import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { toast } from "react-toastify";

interface QrScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QrScannerDialog: React.FC<QrScannerDialogProps> = ({
  open,
  onClose,
  onScan,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader-img");
    try {
      const result = await html5QrCode.scanFile(file, true);
      onScan(result);
    } catch {
      toast.error("Failed to scan image QR");
    }
  };

  useEffect(() => {
    if (!open) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader-live",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false,
    );

    scannerRef.current.render(
      (text) => {
        onScan(text);
        scannerRef.current?.clear().catch(() => {});
        scannerRef.current = null;
      },
      (err) => console.warn("Live scan error", err),
    );

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="bg-opacity-40 bg fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-[95%] max-w-md rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">Scan QR</h2>
          <button onClick={onClose}>✖</button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 block w-full rounded border p-1"
        />
        <div id="qr-reader-live" className="rounded-md border p-2" />
        <div id="qr-reader-img" className="hidden" />
      </div>
    </div>
  );
};

export default QrScannerDialog;
