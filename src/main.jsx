import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Home from './Home.jsx'
import QRPage from './pages/QRPage.jsx'   // 🔥 NUEVA PÁGINA QR
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Página principal (solo si quieres un admin o landing) */}
        <Route path="/" element={<App />} />

        {/* Invitación dinámica real */}
        <Route path="/invitacion/:id" element={<Home />} />

        {/* Página para cuando escaneen el QR */}
        <Route path="/qr/:id" element={<QRPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
