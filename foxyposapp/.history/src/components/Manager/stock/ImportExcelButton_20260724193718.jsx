import { Upload } from "lucide-react";
import { useRef } from "react";


export default function ImportExcelButton({ onUpload }) {

  const inputRef = useRef(null);


  function handleFileChange(e) {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    onUpload(file);

    e.target.value = "";

  }


  return (
    <>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />


      <button
        onClick={() => inputRef.current.click()}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold"
      >

        <Upload size={18} />

        Import Excel

      </button>

    </>
  );
}