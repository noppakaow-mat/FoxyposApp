import { useEffect, useState } from "react";

import Header from "../../components/manager/Header";

import StockTable from "../../components/manager/stock/StockTable";
import ImportExcelButton from "../../components/manager/stock/ImportExcelButton";

import {
  getStocks,
  uploadStockExcel
} from "../../services/managerService";


export default function StockPage() {

  const [stocks, setStocks] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchStocks();
  }, []);



  async function fetchStocks() {

    try {

      const data = await getStocks();

      setStocks(data);

    } catch (error) {

      console.error(
        "Stock loading error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  async function handleUpload(file) {

    try {

      await uploadStockExcel(file);

      fetchStocks();

    } catch (error) {

      console.error(
        "Upload stock error:",
        error
      );

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