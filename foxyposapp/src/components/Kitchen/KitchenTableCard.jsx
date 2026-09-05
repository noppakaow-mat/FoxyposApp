import KitchenOrder from "./KitchenOrder";

export default function KitchenTableCard({
  table,
  openOrders,
  toggleOrder,
  serveOrder,
}) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl">
      <h2 className="text-2xl font-black">
        โต๊ะ {table.table_number}
      </h2>

      {(table.orders || []).map((order) => (
        <KitchenOrder
          key={order.id}
          order={order}
          isOpen={!!openOrders[order.id]}
          toggleOrder={toggleOrder}
          serveOrder={serveOrder}
        />
      ))}
    </article>
  );
}