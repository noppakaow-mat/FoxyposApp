import { Upload } from "lucide-react";
import { useRef } from "react";


export default function ImportExcelButton({ onUpload }) {

  const fileInputRef = useRef(null);


  function handleClick() {
    fileInputRef.current.click();
  }


  function handleChange(event) {

    const file = event.target.files[0];


    if (!file) {
      return;
    }


    const fileType = file.name.split(".").pop();


    if (!["xlsx", "xls"].includes(fileType)) {

      alert("กรุณาเลือกไฟล์ Excel เท่านั้น");

      event.target.value = "";

      return;
    }


    onUpload(file);


    event.target.value = "";

  }


  return (
    <>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        className="hidden"
      />


      <button
        onClick={handleClick}
        className="
          flex
          items-center
          gap-2
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          px-4
          py-2
          rounded-xl
          font-semibold
          transition
        "
      >

        <Upload size={18} />

        Import Excel

      </button>

    </>
  );
}