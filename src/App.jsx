// App.jsx - FULLY UPDATED ROLE-BASED ROUTING SYSTEM (HARDENED)
// ------------------------------------------------------------
// Handles:
// 1. PUBLIC ROUTES (Login)
// 2. ADMIN ROUTES      (Protected + Validated)
// 3. SHOP OWNER ROUTES (Protected + Validated)
// 4. BLOCK unauthorized user access
// 5. Redirect invalid routes inside admin/shop
// ------------------------------------------------------------

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH PAGE
import Auth from "./pages/auth/auth.jsx";

// LAYOUTS
import AdminLayout from "./layouts/AdminLayout";
import ShopOwnerLayout from "./layouts/ShopOwnerLayout";

// PROTECTION COMPONENTS
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/AuthGuard";

/* -----------------------------------------
   ADMIN PAGE IMPORTS
----------------------------------------- */

// Dashboard
import Dashboard from "./pages/admin/Dashboard";

// Shops
import AllShops from "./pages/admin/shops/AllShops";
import ApproveShops from "./pages/admin/shops/ApproveShops";
import SuspendedShops from "./pages/admin/shops/SuspendedShops";

// Customers
import CustomerList from "./pages/admin/customers/CustomerList";
import CustomerOrders from "./pages/admin/customers/CustomerOrders";

// Orders
import Orders from "./pages/admin/orders/Orders";
import OrdersNew from "./pages/admin/orders/OrdersNew";
import OrdersProgress from "./pages/admin/orders/OrdersProgress";
import OrdersCompleted from "./pages/admin/orders/OrdersCompleted";
import OrdersCancelled from "./pages/admin/orders/OrdersCancelled";

// Delivery
import AddRider from "./pages/admin/delivery/AddRider";
import RiderList from "./pages/admin/delivery/RiderList";
import DeliveryLogs from "./pages/admin/delivery/DeliveryLogs";
import DeliveryPerformance from "./pages/admin/delivery/DeliveryPerformance";

// Payments
import MobileMoney from "./pages/admin/payments/MobileMoney";
import PlatformRevenue from "./pages/admin/payments/PlatformRevenue";
import SubscriptionPayments from "./pages/admin/payments/SubscriptionPayments";

// Reports
import SalesReport from "./pages/admin/reports/SalesReport";
import ShopPerformance from "./pages/admin/reports/ShopPerformance";
import MarketplaceOverview from "./pages/admin/reports/MarketplaceOverview";
import FinancialReports from "./pages/admin/reports/FinancialReports";

// Templates
import StoreTemplates from "./pages/admin/templates/StoreTemplates";
import TemplateAdd from "./pages/admin/templates/TemplateAdd";

// Settings
import PlatformSettings from "./pages/admin/settings/PlatformSettings";
import RolesPermissions from "./pages/admin/settings/RolesPermissions";
import APIKeys from "./pages/admin/settings/APIKeys";
import EmailSms from "./pages/admin/settings/EmailSms";

// Support
import SupportTickets from "./pages/admin/support/SupportTickets";
import SupportIssues from "./pages/admin/support/SupportIssues";

// Notifications
import AdminNotifications from "./pages/admin/Notifications";

/* -----------------------------------------
   SHOP OWNER PAGE IMPORTS
----------------------------------------- */

// Dashboard
import ShopOwnerDashboard from "./pages/shopOwner/Dashboard";

// Products
import AddProduct from "./pages/shopOwner/products/AddProduct";
import AllProducts from "./pages/shopOwner/products/AllProducts";
import Categories from "./pages/shopOwner/products/Categories";
import Inventory from "./pages/shopOwner/products/Inventory";

// Orders
import OrdersNewSO from "./pages/shopOwner/orders/OrdersNew";


// Delivery
import AssignRider from "./pages/shopOwner/delivery/AssignRider";
import DeliveryStatus from "./pages/shopOwner/delivery/DeliveryStatus";

// Customers
import ShopCustomerList from "./pages/shopOwner/customers/CustomerList";
import ShopOrderHistory from "./pages/shopOwner/customers/OrderHistory";

// Reports
import SalesReportsSO from "./pages/shopOwner/reports/SalesReports";
import ProductPerformanceSO from "./pages/shopOwner/reports/ProductPerformance";

// Discounts
import CreateDiscount from "./pages/shopOwner/discounts/CreateDiscount";
import ActiveDiscounts from "./pages/shopOwner/discounts/ActiveDiscounts";

// Settings
import StoreProfile from "./pages/shopOwner/settings/StoreProfile";
import Branding from "./pages/shopOwner/settings/Branding";
import WorkingHours from "./pages/shopOwner/settings/WorkingHours";
import DeliveryFees from "./pages/shopOwner/settings/DeliveryFees";
import PaymentMethods from "./pages/shopOwner/settings/PaymentMethods";

// Branches (Pro)
import BranchList from "./pages/shopOwner/branches/BranchList";
import AddBranch from "./pages/shopOwner/branches/AddBranch";

// Staff (Future)
import StaffList from "./pages/shopOwner/staff/StaffList";
import AddStaff from "./pages/shopOwner/staff/AddStaff";

// Billing & Notifications
import SubscriptionBilling from "./pages/shopOwner/SubscriptionBilling";
import ShopOwnerNotifications from "./pages/shopOwner/Notifications";

/* -----------------------------------------
   404 PAGE
----------------------------------------- */

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  </div>
);

/* -----------------------------------------
   MAIN APPLICATION ROUTER
----------------------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Prevent invalid dashboard redirect */}
        <Route path="/dashboard" element={<Navigate to="/shop" replace />} />

        {/* -----------------------------------------
            ADMIN ROUTES (Protected)
        ----------------------------------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Shops */}
          <Route path="shops" element={<AllShops />} />
          <Route path="shops/approve" element={<ApproveShops />} />
          <Route path="shops/suspended" element={<SuspendedShops />} />

          {/* Customers */}
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/orders" element={<CustomerOrders />} />

          {/* Orders */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrdersNew />} />
          <Route path="orders/progress" element={<OrdersProgress />} />
          <Route path="orders/completed" element={<OrdersCompleted />} />
          <Route path="orders/cancelled" element={<OrdersCancelled />} />

          {/* Delivery */}
          <Route path="delivery/add-rider" element={<AddRider />} />
          <Route path="delivery/riders" element={<RiderList />} />
          <Route path="delivery/logs" element={<DeliveryLogs />} />
          <Route path="delivery/performance" element={<DeliveryPerformance />} />

          {/* Payments */}
          <Route path="payments/mobile-money" element={<MobileMoney />} />
          <Route path="payments/revenue" element={<PlatformRevenue />} />
          <Route path="payments/subscriptions" element={<SubscriptionPayments />} />

          {/* Reports */}
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/shop-performance" element={<ShopPerformance />} />
          <Route path="reports/overview" element={<MarketplaceOverview />} />
          <Route path="reports/financial" element={<FinancialReports />} />

          {/* Templates */}
          <Route path="templates" element={<StoreTemplates />} />
          <Route path="templates/add" element={<TemplateAdd />} />

          {/* Settings */}
          <Route path="settings/platform" element={<PlatformSettings />} />
          <Route path="settings/roles" element={<RolesPermissions />} />
          <Route path="settings/api" element={<APIKeys />} />
          <Route path="settings/notifications" element={<EmailSms />} />

          {/* Support */}
          <Route path="support/tickets" element={<SupportTickets />} />
          <Route path="support/issues" element={<SupportIssues />} />

          {/* Notifications */}
          <Route path="notifications" element={<AdminNotifications />} />

          {/* ADMIN 404 INSIDE ADMIN PANEL */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* -----------------------------------------
            SHOP OWNER ROUTES (Protected)
        ----------------------------------------- */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute requiredRole="shopOwner">
              <AuthGuard>
                <ShopOwnerLayout />
              </AuthGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<ShopOwnerDashboard />} />

          {/* Products */}
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />   // ✅ ADD THIS
          <Route path="products/all" element={<AllProducts />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/inventory" element={<Inventory />} />


          {/* Orders */}
          <Route path="orders/new" element={<OrdersNewSO />} />


          {/* Delivery */}
          <Route path="delivery/assign" element={<AssignRider />} />
          <Route path="delivery/status" element={<DeliveryStatus />} />

          {/* Customers */}
          <Route path="customers/list" element={<ShopCustomerList />} />
          <Route path="customers/history" element={<ShopOrderHistory />} />

          {/* Reports */}
          <Route path="reports/sales" element={<SalesReportsSO />} />
          <Route path="reports/performance" element={<ProductPerformanceSO />} />

          {/* Discounts */}
          <Route path="discounts/new" element={<CreateDiscount />} />
          <Route path="discounts/active" element={<ActiveDiscounts />} />

          {/* Settings */}
          <Route path="settings/profile" element={<StoreProfile />} />
          <Route path="settings/branding" element={<Branding />} />
          <Route path="settings/hours" element={<WorkingHours />} />
          <Route path="settings/delivery" element={<DeliveryFees />} />
          <Route path="settings/payments" element={<PaymentMethods />} />

          {/* Branches */}
          <Route path="branches" element={<BranchList />} />
          <Route path="branches/add" element={<AddBranch />} />

          {/* Staff */}
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/add" element={<AddStaff />} />

          {/* Billing & Notifications */}
          <Route path="billing" element={<SubscriptionBilling />} />
          <Route path="notifications" element={<ShopOwnerNotifications />} />

          {/* SHOP OWNER 404 INSIDE SHOP PANEL */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ROOT 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
