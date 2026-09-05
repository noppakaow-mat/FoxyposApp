import { useEffect, useState } from "react";
import OpenTableModal from "../../components/OpenTableModal";
import ReceiptSlip from "../../components/ReceiptSlip";
import { getTables, openTable } from "../../services/tableApi";

export default function TableManagementScreen() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      setLoading(true);

      const res = await getTables();

      // ✅ normalize กัน API รูปแบบไม่แน่นอน
      const tableData = res?.data || res?.tables || res;

      setTables(tableData);
    } catch (err) {
      alert("โหลดโต๊ะไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTable = async (data) => {
    try {
      setLoading(true);

      const res = await openTable(data);

      const receiptData = res?.data || res;

      setReceipt(receiptData);

      // reset modal
      setSelectedTable(null);

      await loadTable();
    } catch (err) {
      alert(err?.response?.data?.message || "เปิดโต๊ะไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Table Management
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="mb-4 text-blue-500">Loading...</p>
      )}

      {/* TABLE GRID */}
      <div className="grid grid-cols-5 gap-5">
        {tables.map((table) => (
          <div
            key={table.table_id}
            onClick={() => {
              if (table.status !== "available") return;
              setSelectedTable(table);
            }}
            className={`
              rounded-xl
              cursor-pointer
              text-center
              text-white
              p-10
              font-bold
              shadow
              transition
              hover:scale-105
              select-none
              ${table.status === "available"
                ? "bg-green-500"
                : "bg-red-500"
              }
            `}
          >
            <div className="text-sm opacity-80">Table</div>
            <div className="text-2xl">{table.table_number}</div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedTable && (
        <OpenTableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onSubmit={handleOpenTable}
        />
      )}

      {/* RECEIPT */}
      {receipt && (
        <div className="fixed right-5 top-5 bg-white p-3 shadow-xl rounded-xl">
          
          {/* slip width 300px */}
          <div className="w-[300px]" id="receipt-area">
            <ReceiptSlip data={receipt} />
          </div>

          <button
            onClick={() => {
              const printContent = document.getElementById("receipt-area");
              const win = window.open("", "", "width=400,height=600");

              win.document.write(`
                <html>
                  <head>
                    <title>Receipt</title>
                    <style>
                      body { font-family: monospace; }
                    </style>
                  </head>
                  <body>
                    ${printContent.innerHTML}
                  </body>
                </html>
              `);

              win.document.close();
              win.print();
              win.close();
            }}
            className="mt-3 w-full bg-black text-white p-3 rounded"
          >
            Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}