import { useEffect, useState } from "react";



import StockTable from "../../components/manager/stock/StockTable";
import ImportExcelButton from "../../components/manager/stock/ImportExcelButton";

import {
    getStocks,
    uploadStockExcel
} from "../../services/stockService";


export default function StockScreen() {

    const [stocks, setStocks] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadStocks();
    }, []);


    async function loadStocks() {

        try {

            const data = await getStocks();

            setStocks(data);

        } catch (error) {

            console.error("Load stock error:", error);

        } finally {

            setLoading(false);

        }

    }


    async function handleUpload(file) {

        try {

            await uploadStockExcel(file);

            loadStocks();

        } catch (error) {

            console.error("Upload stock error:", error);

        }

    }


    if (loading) {

        return (
            <div className="p-6">
                Loading stock...
            </div>
        );

    }


    return (
        <div className="space-y-6">

            <Header title="Stock Management" />


            <div className="flex justify-end">

                <ImportExcelButton
                    onUpload={handleUpload}
                />

            </div>


            <StockTable
                stocks={stocks}
            />

        </div>
    );
}