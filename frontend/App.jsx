import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

// Placeholder pages (to be built)
const Home = () => <div className="p-8 text-2xl font-bold text-gray-800">🏠 Homepage — Coming Soon</div>;
const NotFound = () => <div className="p-8 text-xl text-red-500">404 — Page Not Found</div>;

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
