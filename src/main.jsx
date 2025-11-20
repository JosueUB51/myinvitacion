import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Home from './Home.jsx'
import QRPage from './pages/QRPage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Pantalla inicial */}
        <Route path="/" element={<App />} />

        {/* Aquí entra App.jsx cuando llega invitación */}
        <Route path="/invitacion/:id" element={<App />} />

        {/* App.jsx enviará aquí después del click */}
        <Route path="/home/:id" element={<Home />} />

        {/* Página del QR */}
        <Route path="/qr/:id" element={<QRPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
