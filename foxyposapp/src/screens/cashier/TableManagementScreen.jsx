import { useEffect, useState } from "react";
import { getTables, openTable, checkoutTable } from "./cashierService";
import CheckoutPanel from "../../components/Table/CheckoutPanel";
import OpenTableModal from "../../components/Table/OpenTableModal";
import personIcon from "../../assets/icons/person.svg";

export default function TableManagementScreen() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checkoutTableData, setCheckoutTableData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // LOAD TABLES
  // ============================
  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    try {
      const data = await getTables();
      setTables(data || []); // ป้องกันกรณี API ส่งค่ากลับมาเป็น null/undefined
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลโต๊ะไม่สำเร็จ");
    }
  }

  // ============================
  // OPEN TABLE
  // ============================
  async function handleOpen(data) {
    try {
      setLoading(true);
      const result = await openTable(data);

      // ใช้ Optional Chaining ป้องกันกรณีข้อมูล session ส่งมาไม่ครบ
      if (result?.session?.id) {
        window.open(
          `/receipt/${result.session.id}`,
          "_blank",
          "width=400,height=700"
        );
      }

      setSelected(null);
      await loadTables();
    } catch (err) {
      console.error(err);
      alert(err.message || "เปิดโต๊ะไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  // ============================
  // CHECKOUT
  // ============================
  async function handleFinishPayment() {
    if (!checkoutTableData?.id) return;

    try {
      await checkoutTable(checkoutTableData.id);
      setCheckoutTableData(null);
      await loadTables();
    } catch (err) {
      console.error(err);
      alert(err.message || "Checkout ล้มเหลว");
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 text-zinc-100 md:p-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.35em] text-zinc-500">FOXY SHABU</p>
        <h1 className="mt-2 text-2xl font-black md:text-4xl">TABLE OVERVIEW</h1>
      </header>

      {/* TABLE GRID */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {(tables || []).map((table) => {
          const isAvailable = table.status === "available";

          return (
            <button
              key={table.id || table.table_number}
              onClick={() => {
                if (isAvailable) {
                  setSelected(table);
                } else {
                  setCheckoutTableData(table);
                }
              }}
              className={`relative flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl p-4 shadow-xl transition-all duration-250 hover:scale-[1.03] active:scale-95 ${
                isAvailable
                  ? "bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/40 text-emerald-400"
                  : "bg-rose-950/40 border border-rose-850 hover:bg-rose-900/40 text-rose-400"
              }`}
            >
              <p className="text-[11px] font-bold tracking-wider opacity-60">TABLE</p>
              <h2 className="mt-1 text-5xl font-black tracking-tight">{table.table_number}</h2>
              <p className="mt-3 rounded-full bg-current/10 px-3 py-0.5 text-xs font-bold mb-2 ">
                {isAvailable ? "ว่าง" : "ไม่ว่าง"}
              </p>

              {/* CUSTOMER COUNT BADGE */}
              {!isAvailable && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900/80 px-2 py-1 text-zinc-300 border border-zinc-800 backdrop-blur-sm">
                  <img
                    src={personIcon}
                    alt="Customer"
                    className="h-3.5 w-3.5 opacity-70 invert"
                  />
                  <span className="text-xs font-bold ">
                    {table.customer_count || 0} คน
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* MODALS & PANELS */}
      <OpenTableModal
        table={selected}
        loading={loading}
        onClose={() => setSelected(null)}
        onSubmit={handleOpen}
      />

      <CheckoutPanel
        table={checkoutTableData}
        onClose={() => setCheckoutTableData(null)}
        onFinish={handleFinishPayment}
      />
    </div>
  );
}