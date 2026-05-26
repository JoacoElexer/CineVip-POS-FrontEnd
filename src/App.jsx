import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import Dulceria from './pages/Dulceria.jsx';
import Boletera from './pages/Boletera.jsx';
import Inventario from './pages/Inventario.jsx';
import ReporteCierre from './pages/ReporteCierre.jsx';
import Admin from './pages/Admin.jsx';
import Cuenta from './pages/Cuenta.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dulceria" replace />} />
          <Route path="/dulceria" element={<Dulceria />} />
          <Route path="/boletera" element={<Boletera />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/reportes" element={<ReporteCierre />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cuenta" element={<Cuenta />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
