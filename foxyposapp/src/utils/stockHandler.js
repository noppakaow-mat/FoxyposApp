import {
    uploadStockExcel,
    increaseStock,
    decreaseStock,
    updateStock,
    createStock,
    deleteStock,
} from "../services/stockService";



export async function handleUpload(file,loadStocks){

    try{

        await uploadStockExcel(file);

        await loadStocks();

    }catch(error){

        console.error(
            "Upload stock error:",
            error
        );

    }

}



export async function handleIncrease(id,q,loadStocks){

    try{

        await increaseStock(
            id,
            q
        );

        await loadStocks();

    }catch(error){

        console.error(
            "Increase stock error:",
            error
        );

    }

}



export async function handleDecrease(id,q,loadStocks){

    try{

        await decreaseStock(
            id,
            q
        );

        await loadStocks();

    }catch(error){

        console.error(
            "Decrease stock error:",
            error
        );

    }

}



export async function handleUpdate(id,q,loadStocks){

    try{

        await updateStock(
            id,
            {
                quantity:q
            }
        );

        await loadStocks();

    }catch(error){

        console.error(
            "Update stock error:",
            error
        );

    }

}



export async function handleCreateStock(
    data,
    loadStocks,
    close
){

    try{

        await createStock(data);

        await loadStocks();

        close();

    }catch(error){

        console.error(
            "Create stock error:",
            error
        );

    }

}



export async function handleDelete(id,loadStocks){

    try{

        await deleteStock(id);

        await loadStocks();

    }catch(error){

        console.error(
            "Delete stock error:",
            error
        );

    }

}