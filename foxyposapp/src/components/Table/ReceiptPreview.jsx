import ReceiptSlip from "../ReceiptSlip";

export default function ReceiptPreview({ data, onClose }) {
  return (
    <div className="fixed right-5 top-20 z-50 rounded-xl bg-white p-3 shadow-xl">
      <button onClick={onClose} className="float-right">
        ✕
      </button>

      <div className="w-[300px]">
        <ReceiptSlip data={data} />
      </div>
    </div>
  );
}