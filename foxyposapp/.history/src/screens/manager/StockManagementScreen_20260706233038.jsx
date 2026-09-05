import { useState } from "react";
import { uploadStockExcel } from "../../services/managerService";

export default function StockManagementScreen() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setLoading(true);

    const res = await uploadStockExcel(file);

    if (res?.message) {
      setMessage("✅ " + res.message);
      setFile(null);
    } else {
      setMessage("❌ Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <p className="text-gray-500">
          Upload Excel file to update inventory
        </p>
      </div>

      {/* DROPZONE */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 p-10 text-center rounded-xl bg-white"
      >
        <p className="text-gray-500">
          Drag & Drop Excel file here
        </p>

        <p className="text-sm text-gray-400 mt-2">
          or click to select file
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="mt-4"
        />
      </div>

      {/* FILE INFO */}
      {file && (
        <div className="bg-gray-100 p-3 rounded">
          📄 Selected file: <b>{file.name}</b>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        {loading ? "Uploading..." : "Upload Stock"}
      </button>

      {/* MESSAGE */}
      {message && (
        <div className="mt-3 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}