import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FounderDashboard from './pages/founder/Dashboard';
import CreateBusiness from './pages/founder/CreateBusiness';
import PitchUpload from './pages/founder/PitchUpload';
import FounderOffers from './pages/founder/FounderOffers';
import BrowseBusinesses from './pages/investor/BrowseBusinesses';
import BusinessDetail from './pages/investor/BusinessDetail';
import InvestorOffers from './pages/investor/InvestorOffers';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChatPage from './pages/chat/ChatPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Founder */}
              <Route path="/founder/dashboard" element={
                <ProtectedRoute roles={['FOUNDER']}><FounderDashboard /></ProtectedRoute>
              } />
              <Route path="/founder/create" element={
                <ProtectedRoute roles={['FOUNDER']}><CreateBusiness /></ProtectedRoute>
              } />
              <Route path="/founder/pitch/:businessId" element={
                <ProtectedRoute roles={['FOUNDER']}><PitchUpload /></ProtectedRoute>
              } />
              <Route path="/founder/offers" element={
                <ProtectedRoute roles={['FOUNDER']}><FounderOffers /></ProtectedRoute>
              } />

              {/* Investor */}
              <Route path="/investor/browse" element={
                <ProtectedRoute roles={['INVESTOR']}><BrowseBusinesses /></ProtectedRoute>
              } />
              <Route path="/investor/business/:id" element={
                <ProtectedRoute roles={['INVESTOR']}><BusinessDetail /></ProtectedRoute>
              } />
              <Route path="/investor/offers" element={
                <ProtectedRoute roles={['INVESTOR']}><InvestorOffers /></ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Chat (both Founder and Investor) */}
              <Route path="/chat" element={
                <ProtectedRoute roles={['FOUNDER', 'INVESTOR']}><ChatPage /></ProtectedRoute>
              } />
              {/* 404 */}
              <Route path="*" element={
                <div className="flex items-center justify-center py-32">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                    <p className="text-gray-500 mb-6">Page not found</p>
                    <a href="/" className="text-primary-600 font-medium hover:underline">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
