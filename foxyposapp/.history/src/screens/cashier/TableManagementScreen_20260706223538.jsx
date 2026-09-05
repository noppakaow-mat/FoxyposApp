import { useEffect, useState } from "react";
import { getTables, openTable } from "../../services/tableService";
import { getPackages } from "../../services/packageService";
import ReceiptSlip from "../../components/ReceiptSlip";

export default function TableManagementScreen() {

    const [tables,setTables]=useState([]);
    const [packages,setPackages]=useState([]);
    const [selectedTable,setSelectedTable]=useState(null);
    const [people,setPeople]=useState(1);
    const [packageId,setPackageId]=useState("");
    const [receipt,setReceipt]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    useEffect(()=>{
        loadTables();
        loadPackages();
    },[]);

    const loadTables=async()=>{
        try {
            const data=await getTables();
            setTables(data);
        } catch (err) {
            setError("Failed to load tables");
            console.error(err);
        }
    };

    const loadPackages=async()=>{
        try {
            const data=await getPackages();
            setPackages(data);
            if(data.length>0){
                setPackageId(data[0].id);
            }
        } catch (err) {
            setError("Failed to load packages");
            console.error(err);
        }
    };

    const handleOpen=async()=>{
        if(!people || people < 1) {
            setError("Please enter a valid number of guests");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result=await openTable({
                table_id:selectedTable.id,
                customer_count:people,
                package_id:packageId
            });

            const pkg=packages.find(p=>p.id==packageId);

            setReceipt({
                table_id:selectedTable.id,
                table_no:selectedTable.table_number,
                people:parseInt(people),
                package:pkg
            });

            setSelectedTable(null);
            setPeople(1);
            loadTables();
        } catch (err) {
            setError("Failed to open table");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseReceipt=()=>{
        setReceipt(null);
        loadTables();
    };

    return(
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">
                Table Management
            </h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-red-700 font-bold hover:text-red-900"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map(table=>(
                    <button
                        key={table.id}
                        disabled={table.status==="occupied"}
                        onClick={()=>setSelectedTable(table)}
                        className={`h-32 rounded-xl text-white text-2xl font-bold transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:scale-100
                        ${
                            table.status==="available"
                            ?"bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                            :"bg-red-500 opacity-50 cursor-not-allowed"
                        }`}
                    >
                        <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-lg opacity-80">Table</span>
                            <span className="text-4xl">{table.table_number}</span>
                        </div>
                    </button>
                ))}
            </div>

            {
                selectedTable &&
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Open Table {selectedTable.table_number}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    className="border-2 border-gray-300 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={people}
                                    min="1"
                                    onChange={(e)=>setPeople(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Buffet Package
                                </label>
                                <select
                                    className="border-2 border-gray-300 w-full p-3 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={packageId}
                                    onChange={(e)=>setPackageId(e.target.value)}
                                >
                                    {
                                        packages.map(p=>(
                                            <option
                                                key={p.id}
                                                value={p.id}
                                            >
                                                {p.name} - {p.price}฿/person
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 flex-1 py-3 rounded-lg font-semibold text-gray-800 transition-colors"
                                onClick={()=>{
                                    setSelectedTable(null);
                                    setError(null);
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                onClick={handleOpen}
                                disabled={loading}
                            >
                                {loading ? "Opening..." : "Open Table"}
                            </button>
                        </div>
                    </div>
                </div>
            }

            {
                receipt &&
                <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        Receipt Slip
                    </h3>
                    
                    <ReceiptSlip data={receipt}/>

                    <div className="flex gap-3 mt-6">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3 rounded-lg font-semibold transition-colors"
                            onClick={()=>window.print()}
                        >
                            🖨️ Print Receipt
                        </button>

                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white flex-1 py-3 rounded-lg font-semibold transition-colors"
                            onClick={handleCloseReceipt}
                        >
                            Back to Tables
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}