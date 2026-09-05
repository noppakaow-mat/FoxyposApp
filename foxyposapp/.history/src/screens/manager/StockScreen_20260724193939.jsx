import { useEffect, useState } from "react";

import Header from "../../components/manager/Header";

import StockTable from "../../components/manager/stock/StockTable";
import ImportExcelButton from "../../components/manager/stock/ImportExcelButton";

import {
  getStocks,
} from "../../services/stockService";


export default function StockPage() {

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

      console.error(
        "Load stock error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  async function handleUpload(file) {

    console.log(file);

    // เดี๋ยวต่อ upload excel service ตรงนี้

  }



  if (loading) {

    return (
      <div className="p-6">
        Loading...
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