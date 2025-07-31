import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';

// Import new pages
import RecordMilk from './pages/milk/RecordMilk';
import NewHealthRecord from './pages/health/NewHealthRecord';
import AddFeedStock from './pages/feeds/AddFeedStock';
import AddBreed from './pages/breeds/AddBreed';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute admin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Farmer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Milk Routes */}
            <Route
              path="/milk/add"
              element={
                <ProtectedRoute>
                  <RecordMilk />
                </ProtectedRoute>
              }
            />

            {/* Health Routes */}
            <Route
              path="/health/new"
              element={
                <ProtectedRoute>
                  <NewHealthRecord />
                </ProtectedRoute>
              }
            />

            {/* Feed Routes */}
            <Route
              path="/feeds/new"
              element={
                <ProtectedRoute>
                  <AddFeedStock />
                </ProtectedRoute>
              }
            />

            {/* Breed Routes */}
            <Route
              path="/breeds/new"
              element={
                <ProtectedRoute>
                  <AddBreed />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
