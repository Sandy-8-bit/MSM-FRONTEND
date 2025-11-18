// components/QRScanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

type QRData = {
  [key: string]: string;
};

const QRScanner: React.FC = () => {
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<QRData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseQRData = (data: string): QRData => {
    const result: QRData = {};

    if (data.includes(":")) {
      const lines = data.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        const [key, value] = line.split(":");
        if (key && value) {
          result[key.trim()] = value.trim();
        }
      }
    } else {
      result["serialNumber"] = data.trim();
    }

    return result;
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    scanner.render(
      (decodedText) => {
        setScannedText(decodedText);
        const parsed = parseQRData(decodedText);
        setParsedData(parsed);
        scanner.clear(); // stop scanner after success
      },
      (err) => {
        console.warn("Scan error", err);
      },
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    try {
      const result = await html5QrCode.scanFile(file, true);
      setScannedText(result);
      setParsedData(parseQRData(result));
    } catch (err) {
      console.error("Image scan error", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 p-6">
      <div
        id="qr-reader"
        className="custom-scanner-ui w-full max-w-md rounded-xl border-2 border-indigo-300 bg-white p-4 shadow-lg"
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Upload QR Image
      </button>

      {parsedData && (
        <div className="mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-indigo-700">
            Machine Details
          </h2>
          <ul className="space-y-2">
            {Object.entries(parsedData).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-medium text-gray-600">{key}</span>
                <span className="text-gray-800">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
