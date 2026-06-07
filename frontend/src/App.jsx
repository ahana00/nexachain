import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Roi from './pages/Roi';
import Referrals from './pages/Referrals';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="layout">
            <Sidebar/>
            <main className="main">
              <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/investments" element={<Investments/>}/>
                <Route path="/roi" element={<Roi/>}/>
                <Route path="/referrals" element={<Referrals/>}/>
              </Routes>
            </main>
          </div>
        </ProtectedRoute>
      }/>
    </Routes>
  );
}
