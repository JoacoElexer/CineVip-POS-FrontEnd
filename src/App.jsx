import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
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
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dulceria" replace />} />
              <Route path="/dulceria" element={<Dulceria />} />
              <Route path="/boletera" element={<Boletera />} />
              <Route path="/reportes" element={<ReporteCierre />} />
              <Route path="/cuenta" element={<Cuenta />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Almacenista']} />}>
              <Route path="/inventario" element={<Inventario />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
