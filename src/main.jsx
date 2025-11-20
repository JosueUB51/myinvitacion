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

        {/* Pantalla inicial */}
        <Route path="/" element={<App />} />

        {/* NUEVA ruta para que App.jsx pueda enviar aquí */}
        <Route path="/home" element={<Home />} />

        {/* Invitación real con ID */}
        <Route path="/invitacion/:id" element={<Home />} />

        {/* Página del QR */}
        <Route path="/qr/:id" element={<QRPage />} />

      </Routes>

    </BrowserRouter>
  </StrictMode>,
)
