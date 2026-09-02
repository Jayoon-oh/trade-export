import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
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
      <div className="min-h-screen flex">
        <Header />
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/orders" replace />} />
              <Route path="/stock" element={<StockPage />} />
              <Route path="/companies" element={<CompanyPage />} />
              <Route path="/quotations" element={<QuotationPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/shipments" element={<ShipmentPage />} />
              <Route path="/packing-lists" element={<PackingListPage />} />
              <Route path="/payments" element={<PaymentPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
