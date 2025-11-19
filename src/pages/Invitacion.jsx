import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Home.css";

// Importa aquí todas tus imágenes igual que en Home.jsx
import imag1 from '../assets/imag1.jpg';
import sec2 from '../assets/sec2.png';
import salonImg from '../assets/salon.jpg';
import sec6 from "../assets/sec6.png";
// ... todas las demás

export default function Invitacion() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.0.6:4000/api/invitaciones/${id}`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!data) return <p>Cargando invitación...</p>;

  return (
    <div className="scroll-container">

      {/* SECCIÓN 1 */}
      <section className="section section1">
        <img src={imag1} className="full-image" />

        <div className="text-overlay">
          <h1 className="title">Maricela & Hugo</h1>
          <p className="date">20 DICIEMBRE 2025</p>
        </div>
      </section>

      {/* SECCIÓN 2 */}
      <section className="section section2">
        <div className="section2-content">
          
          <p className="section2-text">¡Es un placer invitarle!</p>
          <p className="invite-name">
            {data.abrev} {data.nombre}
          </p>

          <div className="invite-pass">
            <span className="invite-text">PASE PARA</span>
            <span className="invite-number">{data.pases}</span>
            <span className="invite-text">PERSONAS</span>
          </div>

        </div>
      </section>

      {/* SECCIÓN 9 - Ubicación */}
      <section className="section section9">
        <div className="section9-card">
          <img src={sec6} className="section9-bg-image" />
          
          <h2 className="section9-title">Ubicación</h2>
          <h3>Salón La Ermita</h3>
          <img src={salonImg} className="section9-salon-img" />

          <p className="section9-direccion">
            Carr. a Monte Albán 126, Vicente Suarez,<br />
            Oaxaca de Juárez.
          </p>

          <a
            className="section9-btn"
            href="https://www.google.com/maps/place/Carr.+a+Monte+Alban+126"
            target="_blank"
          >
            Ir a ubicación
          </a>
        </div>
      </section>

      {/* TODAS LAS DEMÁS SECCIONES... */}
      {/* Copia y pega todas las secciones igual que en Home.jsx */}
    </div>
  );
}
