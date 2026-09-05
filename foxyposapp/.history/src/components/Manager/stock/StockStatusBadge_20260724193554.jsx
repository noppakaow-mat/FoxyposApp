export default function StockStatusBadge({ status }) {

  const statusStyle = {
    normal: "bg-green-100 text-green-700",
    low: "bg-yellow-100 text-yellow-700",
    out: "bg-red-100 text-red-700"
  };


  const statusText = {
    normal: "ปกติ",
    low: "ใกล้หมด",
    out: "หมด"
  };


  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${statusStyle[status] || statusStyle.normal}
      `}
    >
      {statusText[status] || "ปกติ"}
    </span>
  );
}