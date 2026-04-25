import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { IframePage } from './IframePage';
import { pagePathByFile, pages } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {pages.map((page) => (
        <Route
          key={page.slug}
          path={page.route}
          element={<IframePage page={page} />}
        />
      ))}
      {Object.entries(pagePathByFile).map(([fileName, route]) => (
        <Route
          key={fileName}
          path={`/${fileName}`}
          element={<Navigate to={route} replace />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
