import { Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/login/LoginScreen";
import ProtectedRoute from "./routes/ProtectedRoute";


// CASHIER
import CashierScreen from "./screens/cashier/Cashier";
import TableManagementScreen from "./screens/cashier/TableManagementScreen";


// KITCHEN
import Kitchen from "./screens/kitchen/Kitchen";


// CUSTOMER
import MenuCatalogScreen from "./screens/customer/MenuCatalogScreen";
import ReceiptScreen from "./screens/customer/ReceiptScreen";
import PaymentScreen from "./screens/customer/PaymentScreen";
import OrderHistoryScreen from "./screens/customer/OrderHistoryScreen";

// manager
import DashboardPage from "./screens/manager/DashboardScreen";
import StockSceenfrom "./screens/manager/StockScreen";
import EmployeeSceen from "./screens/manager/EmployeeSceen";
import ManagerLayout from "./layout/ManagerLayout";

export default function App() {

  return (
    <Routes>


      {/* LOGIN */}
      <Route
        path="/"
        element={<LoginScreen />}
      />



      {/* CASHIER */}
      <Route
        path="/cashier"
        element={
          <ProtectedRoute roles={["cashier"]}>
            <CashierScreen />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<TableManagementScreen />}
        />

        <Route
          path="tables"
          element={<TableManagementScreen />}
        />

      </Route>



      {/* KITCHEN */}
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute roles={["kitchen"]}>
            <Kitchen />
          </ProtectedRoute>
        }
      />

      {/* MANAGER */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<DashboardPage />}
        />


        <Route
          path="dashboard"
          element={<DashboardPage />}
        />


        <Route
          path="stock"
          element={<StockPage />}
        />


        <Route
          path="employees"
          element={<EmployeePage />}
        />

      </Route>

      {/* CUSTOMER QR ORDER */}
      <Route
        path="/order/:sessionId"
        element={<MenuCatalogScreen />}
      />
      <Route
        path="/orders/:sessionId"
        element={<OrderHistoryScreen />}
      />
      <Route
        path="/payment/:sessionId"
        element={<PaymentScreen />}
      />



      {/* RECEIPT */}
      <Route
        path="/receipt/:sessionId"
        element={<ReceiptScreen />}
      />
    </Routes>

  );
}
