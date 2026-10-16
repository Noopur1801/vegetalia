import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import Register from './pages/Register.jsx';
import VendorDashboard from './pages/vendorDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import { CartProvider } from './context/CartContext';
import VendorProducts from './pages/vendorProduct.jsx';
import BuyerMarketplace from './pages/BuyersMarketplace.jsx';
import DriverDeliveries from './pages/DriversDelivery.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import BuyerOrders from './pages/BuyersOrder.jsx';
import VendorSales from './pages/VendorsSales.jsx';
import DriverActive from './pages/DriverActive.jsx';
import Cart from './pages/Cart.jsx';
import AvailableToday from './pages/AvailableToday.jsx';
import BuyerLayout from './pages/BuyerLayout.jsx';
import AvailableTomorrow from './pages/AvailableTomorrow.jsx';
import Available15Days from './pages/Available15days.jsx';
import TrackOrders from './pages/TrackOrder.jsx';
import PreviousOrders from './pages/PreviousOrder.jsx';
import TransactionHistory from './pages/TransactionHistory.jsx';
import VendorLayout from './pages/VendorLayout.jsx';
import VendorOrdersToday from './pages/VendorOrdersToday.jsx';
import VendorDeliveryPartners from './pages/VendorDeliverypartners.jsx';
import VendorOrdersTomorrow from './pages/VendorOrderTomorrow.jsx';
import VendorOrders15Days from './pages/VendorOrder15Days.jsx';
import VendorDeliveryReport from './pages/VendorDelivery.jsx';
import VendorReviews from './pages/VendorReview.jsx';
import DriverLayout from './pages/DriverLayout.jsx';
import DriverToday from './pages/DriverToday.jsx';
import DriverAhead from './pages/DriverAhead.jsx';
import DriverReviews from './pages/DriverReview.jsx';
import DriverProfile from './pages/DriverProfile.jsx';
import AdminLayout from './pages/AdminLayout.jsx';
import AdminBuyers from './pages/AdminBuyers.jsx';
import AdminVendors from './pages/AdminVendors.jsx';
import AdminDrivers from './pages/AdminDrivers.jsx';
import AdminAnalytics from './pages/AdminAnaytics.jsx';
import VendorAddProduct from './pages/VendorAddProduct.jsx';
import VendorMyProducts from './pages/VendorMyProduct.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    // 2. WRAPPED THE ENTIRE APP IN CART PROVIDER
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/buyers" element={<AdminBuyers />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Vendor Only */}
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendor/orders-today" element={<VendorOrdersToday />} />
            <Route path="/vendor/orders-tomorrow" element={<VendorOrdersTomorrow />} />
            <Route path="/vendor/orders-15days" element={<VendorOrders15Days />} />
            <Route path="/vendor/delivery-report" element={<VendorDeliveryReport />} />
            <Route path="/vendor/reviews" element={<VendorReviews />} />
            <Route path="/vendor/my-products" element={<VendorMyProducts />} />
            <Route path="/vendor/add-product" element={<VendorAddProduct />} />
            <Route path="/vendor/partners" element={<VendorDeliveryPartners />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/sales" element={<VendorSales />} />
          </Route>
        </Route>

        {/* Buyer Only */}
        <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
          <Route element={<BuyerLayout />}>
            <Route path="/buyer/avatoday" element={<AvailableToday />} />
            <Route path="/buyer/avatTomorrow" element={<AvailableTomorrow />} />
            <Route path="/buyer/ava15days" element={<Available15Days />} />
            <Route path="/buyer/track" element={<TrackOrders />} />
            <Route path="/buyer/previous" element={<PreviousOrders />} />
            <Route path="/buyer/transactions" element={<TransactionHistory />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />
            <Route path="/buyer/cart" element={<Cart />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
          </Route>
        </Route>

        {/* Driver Only */}
        <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
          <Route element={<DriverLayout />}>
            <Route path="/driver/today" element={<DriverToday />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/driver/deliveries" element={<DriverDeliveries />} />
            <Route path="/driver/ahead" element={<DriverAhead />} />
            <Route path="/driver/active" element={<DriverActive />} />
            <Route path="/driver/reviews" element={<DriverReviews />} />
            <Route path="/driver-dashboard" element={<DriverProfile />} />
          </Route>
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;