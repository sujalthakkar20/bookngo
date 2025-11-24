import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BusSearch from './pages/BusSearch';
import SeatSelection from './pages/SeatSelection';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import Account from './pages/Account';
import Ticket from './pages/Ticket';
import Help from './pages/Help';
import AdminDashboard from './pages/AdminDashboard';
import PackageTrips from './pages/PackageTrips';
import PackageDetails from './pages/PackageDetails';
import PackageBooking from './pages/PackageBooking';
import PackageTicket from './pages/PackageTicket';

import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from "./pages/ScrollToTop";

// Feature pages
import FreeCancellation from './pages/FreeCancellation';
import BusTimetable from './pages/BusTimetable';
import FlexiTicket from './pages/FlexiTicket';
import AssuranceProgram from './pages/AssuranceProgram';

// Footer pages
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Wallet Context (correct path!)
import { WalletProvider } from "./pages/WalletContext";
import Wallet from "./pages/Wallet";
import AddMoney from "./pages/AddMoney";

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <div className="App">
            <Header />
            <ScrollToTop />

            <Routes>

              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/results" element={<BusSearch />} />
              <Route path="/seat-selection/:id" element={<SeatSelection />} />

              <Route path="/booking" element={<Booking />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/account" element={<Account />} />
              <Route path="/ticket/:id" element={<Ticket />} />
              <Route path="/help" element={<Help />} />

              <Route path="/packages" element={<PackageTrips />} />

              {/* <Route path="/package-details/:id" element={<PackageDetails />} /> */}
              <Route path="/packages/:id" element={<PackageDetails />} />

              <Route path="/packages/booking/:id" element={<PackageBooking />} />


              {/* package ticket page */}
              <Route path="/package-ticket/:id" element={<PackageTicket />} />  


              {/* Admin */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Feature Info Pages */}
              <Route path="/free-cancellation" element={<FreeCancellation />} />
              <Route path="/bus-timetable" element={<BusTimetable />} />
              <Route path="/flexi-ticket" element={<FlexiTicket />} />
              <Route path="/assurance-program" element={<AssuranceProgram />} />

              {/* Footer Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Wallet Routes */}
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/add-money" element={<AddMoney />} />

            </Routes>

            <Chatbot />
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
