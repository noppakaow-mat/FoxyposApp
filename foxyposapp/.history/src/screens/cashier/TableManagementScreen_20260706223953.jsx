import { useEffect, useState } from "react";
import OpenTableModal from "../../components/OpenTableModal";
import ReceiptSlip from "../../components/ReceiptSlip";
import {
    getTables,
    openTable
} from "../../services/tableApi";

export default function TableManagementScreen(){

    const [tables,setTables]=useState([]);

    const [selectedTable,setSelectedTable]=useState(null);

    const [receipt,setReceipt]=useState(null);

    useEffect(()=>{
        loadTable();
    },[]);

    const loadTable=async()=>{

        const res=await getTables();

        setTables(res.data);

    }

    const handleOpenTable=async(data)=>{

        try{

            const res=await openTable(data);

            setReceipt(res.data);

            setSelectedTable(null);

            loadTable();

        }

        catch(err){

            alert(err.response.data.message);

        }

    }

    return(

<div className="p-8">

<h1 className="text-3xl font-bold mb-8">

Table Management

</h1>

<div className="grid grid-cols-5 gap-5">

{tables.map(table=>(

<div

key={table.table_id}

onClick={()=>{

if(table.status==="available")

setSelectedTable(table)

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

${table.status==="available"

?

"bg-green-500"

:

"bg-red-500"

}

`}

>

โต๊ะ

{table.table_number}

</div>

))}

</div>

{selectedTable&&(

<OpenTableModal

table={selectedTable}

onClose={()=>setSelectedTable(null)}

onSubmit={handleOpenTable}

/>

)}

{receipt&&(

<div className="fixed right-5 top-5">

<ReceiptSlip

data={receipt}

/>

<button

onClick={()=>window.print()}

className="mt-5 w-full bg-black text-white p-3 rounded"

>

Print Receipt

</button>

</div>

)}

</div>

    )

}