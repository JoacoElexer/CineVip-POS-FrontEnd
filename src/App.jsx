import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dulceria from './pages/Dulceria.jsx';
import Boletera from './pages/Boletera.jsx';
import Inventario from './pages/Inventario.jsx';
import ReporteCierre from './pages/ReporteCierre.jsx';
import Admin from './pages/Admin.jsx';
import Cuenta from './pages/Cuenta.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dulceria" replace />} />
              <Route path="/dulceria" element={<Dulceria />} />
              <Route path="/boletera" element={<Boletera />} />
              <Route path="/reportes" element={<ReporteCierre />} />
              <Route path="/cuenta" element={<Cuenta />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
            <Route element={<MainLayout />}>
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
