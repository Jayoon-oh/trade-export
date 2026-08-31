import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './pages/components/Header'
import Footer from './pages/components/Footer'
import StockPage from './pages/StockPage/StockPage'
import CompanyPage from './pages/CompanyPage/CompanyPage'
import QuotationPage from './pages/QuotationPage/QuotationPage'
import OrdersPage from './pages/OrderPage/OrdersPage'
import ShipmentPage from './pages/ShipmentPage/ShipmentPage'
import PackingListPage from './pages/PackingListPage/PackingListPage'
import PaymentPage from './pages/PaymentPage/PaymentPage'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/stock" element={<StockPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/quotations" element={<QuotationPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/shipments" element={<ShipmentPage />} />
        <Route path="/packing-lists" element={<PackingListPage />} />
        <Route path="/payments" element={<PaymentPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
