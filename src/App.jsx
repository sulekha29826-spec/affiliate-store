import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SastaAIAssistant from './components/ai/SastaAIAssistant';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#EDF1F7] text-[#0F172A]">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
        <SastaAIAssistant />
      </div>
    </BrowserRouter>
  );
}
