export default function StockStatusBadge({
  stock_quantity,
  minimum_stock
}) {
  let status = "normal";

  if (stock_quantity <= 0) {
    status = "out";
  } else if (stock_quantity <= minimum_stock) {
    status = "low";
  }

  const statusStyle = {
    normal: "bg-green-100 text-green-700",
    low: "bg-yellow-100 text-yellow-700",
    out: "bg-red-100 text-red-700",
  };

  const statusText = {
    normal: "ปกติ",
    low: "ใกล้หมด",
    out: "หมด",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[status]}`}
    >
      {statusText[status]}
    </span>
  );
}