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
import DashboardPage from "./pages/manager/DashboardScreen";
import StockPage from "./pages/manager/StockScreen";
import EmployeePage from "./pages/manager/EmployeeScreen";

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

      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute roles={["manager"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/manager/stock"
        element={
          <ProtectedRoute roles={["manager"]}>
            <StockPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/manager/employee"
        element={
          <ProtectedRoute roles={["manager"]}>
            <EmployeePage />
          </ProtectedRoute>
        }
      />

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
