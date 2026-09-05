import { getElapsed, formatDateTime } from "../../screens/kitchen/until/kitchenhelper";
import arrowUp from "../../assets/icons/arrowup.svg";
import arrowDown from "../../assets/icons/arrowdown.svg";

export default function KitchenOrderAccordion({
  order,
  isOpen,
  toggleOrder,
  serveOrder,
}) {
  const status = String(order.status || "").toLowerCase();

  const isPending = status === "pending";
  const isServed = status === "served";

  return (
    <div className="mt-5 border-t border-zinc-800 pt-4">
      {/* HEADER */}
      <button
        onClick={() => toggleOrder(order.id)}
        className="flex w-full items-center justify-between transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        <div className="text-left">
          <p className="text-sm font-black text-yellow-400">
            ORDER {order.order_no}
          </p>
          <p className="text-[11px] text-zinc-500">
            {formatDateTime(order.created_at)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-bold text-yellow-400">
            {getElapsed(order.created_at)}
          </span>
          {isPending && (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[11px] font-bold text-yellow-400">
              กำลังทำ
            </span>
          )}

          {isServed && (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-bold text-green-400">
              เสิร์ฟแล้ว
            </span>
          )}
          <img
            src={isOpen ? arrowUp : arrowDown}
            alt="toggle"
            className="h-10 w-10"
          />
        </div>
      </button>

      {/* CONTENT */}
      {isOpen && (
        <div className="mt-4">
          <ul className="space-y-2 border-b border-zinc-800 pb-4 text-sm">
            {order.items?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between py-0.5"
              >
                <span className="text-zinc-300">
                  {item.name}
                </span>

                <span className="font-bold text-yellow-400">
                  x{item.qty}
                </span>
              </li>
            ))}
          </ul>

          {isPending && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                serveOrder(order.id);
              }}
              className="mt-4 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-500 active:scale-[0.98]"
            >
              เสิร์ฟแล้ว
            </button>
          )}
        </div>
      )}
    </div>
  );
}