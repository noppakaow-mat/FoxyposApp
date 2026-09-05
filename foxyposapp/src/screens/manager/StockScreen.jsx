import { useEffect, useState } from "react";

import StockTable from "../../components/manager/stock/StockTable";
import ImportExcelButton from "../../components/manager/stock/ImportExcelButton";
import AddStockModal from "../../components/manager/stock/AddStockModal";

import { getStocks } from "../../services/stockService";

import {
    handleUpload,
    handleIncrease,
    handleDecrease,
    handleUpdate,
    handleCreateStock,
    handleDelete,
} from "../../utils/stockHandler";


export default function StockScreen() {

    const [stocks, setStocks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openAdd, setOpenAdd] = useState(false);



    useEffect(() => {
        loadStocks();
    }, []);



    async function loadStocks() {
        try {
            const data = await getStocks();
            setStocks(data);
        } catch (error) {
            console.error(
                "Load stock error:",
                error
            );
        } finally {
            setLoading(false);
        }
    }



    const handleChangeStock = (id, value) => {
        setStocks(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity: value
                    }
                    :
                    item
            )
        );
    };


    if (loading) {
        return (
            <div className="p-6">
                Loading stock...
            </div>
        );
    }



    return (

        <div className="space-y-6">

            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setOpenAdd(true)}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold"
                >
                    + เพิ่มสินค้า
                </button>


                <ImportExcelButton
                    onUpload={(file) =>
                        handleUpload(
                            file,
                            loadStocks
                        )
                    }
                />
            </div>


            <StockTable

                stocks={stocks}

                onIncrease={(id, q) =>
                    handleIncrease(
                        id,
                        q,
                        loadStocks
                    )
                }

                onDecrease={(id, q) =>
                    handleDecrease(
                        id,
                        q,
                        loadStocks
                    )
                }

                onChangeStock={handleChangeStock}

                onUpdate={(id, q) =>
                    handleUpdate(
                        id,
                        q,
                        loadStocks
                    )
                }

                onDelete={(id) =>
                    handleDelete(
                        id,
                        loadStocks
                    )
                }

            />


            <AddStockModal

                open={openAdd}

                onClose={() =>
                    setOpenAdd(false)
                }
                onSave={(data) =>
                    handleCreateStock(
                        data,
                        loadStocks,
                        () => setOpenAdd(false)
                    )
                }
            />
        </div>

    );

}