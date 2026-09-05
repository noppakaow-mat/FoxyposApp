import { useState } from "react";

export default function OpenTableModal({
  table,
  loading,
  onClose,
  onSubmit
}) {
  const [packageId, setPackageId] = useState("1");
  const [customer, setCustomer] = useState(1);
  const [packageOpen, setPackageOpen] = useState(false);

  if (!table) return null;

  const packages = [
    { id: "1", name: "Buffet Standard 299" },
    { id: "2", name: "Buffet Premium 499" },
    { id: "3", name: "Buffet Platinum 699" }
  ];

  const selectedPackage = packages.find((item) => item.id === packageId);

  function handleSubmit() {
    onSubmit({
      table_id: table.id,
      package_id: Number(packageId),
      customer_count: Number(customer)
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      {/* MODAL CARD */}
      <div className="w-full max-w-md rounded-3xl border border-zinc-850 bg-zinc-900 p-6 text-zinc-100 shadow-2xl">
        
        {/* HEADER */}
        <div className="mb-6 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-zinc-500">FOXY SHABU</p>
          <h3 className="mt-1 text-2xl font-black">โต๊ะ {table.table_number}</h3>
        </div>

        <div className="space-y-5">
          {/* PACKAGE SELECTOR (CUSTOM DROPDOWN) */}
          <div className="relative">
            <label className="text-xs font-bold text-zinc-400 block mb-2">เลือกแพ็กเกจบุฟเฟต์</label>
            <button
              type="button"
              onClick={() => setPackageOpen(!packageOpen)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all duration-200 ${
                packageOpen
                  ? "border-yellow-500 bg-zinc-950 text-yellow-400 ring-1 ring-yellow-500"
                  : "border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <span>{selectedPackage?.name || "เลือกแพ็กเกจ"}</span>
              <span className={`text-xs transition-transform duration-200 opacity-60 ${packageOpen ? "rotate-180 text-yellow-400 opacity-100" : ""}`}>
                ▼
              </span>
            </button>

            {packageOpen && (
              <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl shadow-black">
                {packages.map((item) => {
                  const isSelected = item.id === packageId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPackageId(item.id);
                        setPackageOpen(false);
                      }}
                      className={`w-full rounded-lg p-3 text-left text-sm transition-colors duration-150 ${
                        isSelected
                          ? "bg-yellow-950/50 text-yellow-400 font-bold"
                          : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CUSTOMER COUNT SELECTOR */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-2">จำนวนลูกค้า (คน)</label>
            <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-2">
              <button
                type="button"
                disabled={customer <= 1}
                onClick={() => setCustomer(Math.max(1, customer - 1))}
                className="flex h-10 w-12 items-center justify-center rounded-lg bg-zinc-900 text-xl font-bold transition active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
              >
                -
              </button>
              <div className="flex-1 text-center font-black text-lg text-zinc-100">
                {customer}
              </div>
              <button
                type="button"
                onClick={() => setCustomer(customer + 1)}
                className="flex h-10 w-12 items-center justify-center rounded-lg bg-zinc-900 text-xl font-bold transition active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-800 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-850 hover:text-zinc-200 active:scale-95 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 active:scale-95 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? "กำลังเปิดโต๊ะ..." : "เปิดโต๊ะ"}
          </button>
        </div>

      </div>
    </div>
  );
}