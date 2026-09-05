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

    useEffect(()=>{

        loadTables();

        loadPackages();

    },[]);

    const loadTables=async()=>{

        const data=await getTables();

        setTables(data);

    };

    const loadPackages=async()=>{

        const data=await getPackages();

        setPackages(data);

        if(data.length>0){

            setPackageId(data[0].id);

        }

    };

    const handleOpen=async()=>{

        const result=await openTable({

            table_id:selectedTable.id,
            customer_count:people,
            package_id:packageId

        });

        const pkg=packages.find(p=>p.id==packageId);

        setReceipt({

            table_id:selectedTable.id,
            table_no:selectedTable.table_number,
            people,
            package:pkg

        });

        setSelectedTable(null);

        loadTables();

    };

    return(

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">

                Table Management

            </h1>

            <div className="grid grid-cols-4 gap-4">

                {tables.map(table=>(

                    <button

                        key={table.id}

                        disabled={table.status==="occupied"}

                        onClick={()=>setSelectedTable(table)}

                        className={`h-28 rounded-xl text-white text-xl font-bold
                        ${
                            table.status==="available"
                            ?"bg-green-500 hover:bg-green-600"
                            :"bg-red-500"
                        }`}
                    >

                        Table {table.table_number}

                    </button>

                ))}

            </div>

            {
                selectedTable &&

                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

                    <div className="bg-white rounded-xl p-6 w-96">

                        <h2 className="text-2xl mb-5">

                            Open Table {selectedTable.table_number}

                        </h2>

                        <label>Guests</label>

                        <input

                            type="number"

                            className="border w-full p-2 mb-4"

                            value={people}

                            onChange={(e)=>setPeople(e.target.value)}

                        />

                        <label>Package</label>

                        <select

                            className="border w-full p-2"

                            value={packageId}

                            onChange={(e)=>setPackageId(e.target.value)}

                        >

                            {
                                packages.map(p=>(

                                    <option
                                        key={p.id}
                                        value={p.id}
                                    >

                                        {p.name} ({p.price}฿)

                                    </option>

                                ))
                            }

                        </select>

                        <div className="flex gap-3 mt-6">

                            <button

                                className="bg-gray-300 flex-1 py-2 rounded"

                                onClick={()=>setSelectedTable(null)}

                            >

                                Cancel

                            </button>

                            <button

                                className="bg-blue-600 text-white flex-1 py-2 rounded"

                                onClick={handleOpen}

                            >

                                Open Table

                            </button>

                        </div>

                    </div>

                </div>

            }

            {
                receipt &&

                <div className="mt-10">

                    <ReceiptSlip data={receipt}/>

                    <button

                        className="mt-4 bg-black text-white px-5 py-2 rounded"

                        onClick={()=>window.print()}

                    >

                        Print Receipt

                    </button>

                </div>
            }

        </div>
    );
}