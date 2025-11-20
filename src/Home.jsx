import { useParams } from "react-router-dom";
import './Home.css'
import { useState, useEffect, useRef } from 'react'
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"
import { io } from "socket.io-client";




// 🖼️ Imágenes principales
import imag1 from './assets/imag1.jpg'
import log1 from './assets/log3.png'
import sec2 from './assets/sec2.png'
import imag2 from './assets/imag2.jpg'
import imag3 from './assets/imag3.jpg'
import sec4 from './assets/sec4.png'
import sec6 from './assets/sec6.png'
import imag4 from './assets/imag4.jpg'
import salonImg from './assets/salon.jpg'
import imag5 from './assets/imag5.jpg'
import liver from './assets/liver.png'
import sobre2 from './assets/sobre2.png'
import vesti from './assets/vesti2.png'
import sec11bg from './assets/sec6.png'
import imag6 from './assets/imag6.jpg'
import imag7 from './assets/imag7.jpg'

// 🎵 Música
import music1 from './assets/music4.mp3'

// 🕊️ Íconos padrinos
import ramo from './assets/ramo.png'
import brindis from './assets/brindis.png'
import anillos from './assets/anillo.png'
import arras2 from './assets/arras2.png'
import biblia from './assets/biblia.png'
import cojin from './assets/cojin.png'
import lazo from './assets/lazo.png'

// Íconos del itinerario
import icon1 from './assets/salon.png'
import icon2 from './assets/iglesia.png'
import icon3 from './assets/comida.png'
import icon4 from './assets/fiesta.png'

export default function Home() {

  // ============================
  // 🎵 CONTROL DE MÚSICA
  // ============================
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [showQRSection, setShowQRSection] = useState(false);


  // MULTI-PASO del modal
  const [step, setStep] = useState(1);

  // Cuántos pases usará el invitado
  const [pasesUsados, setPasesUsados] = useState(1);



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => { });
    }

    setIsPlaying(!isPlaying);
  };


  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}`)
      .then(res => res.json())
      .then(info => setData(info))
      .catch(err => console.error(err));
  }, [id]);


  // ============================
  // ⏳ TIMER BODA
  // ============================
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2025-12-20T00:00:00');

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ======================
  // 🌟 MODAL DE CONFIRMACIÓN
  // ======================
  const [showModal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [finalMessage, setFinalMessage] = useState("");


  // Abrir modal
  const openModal = () => {
    setShowModal(true);
    setSelection(null);
    setFinalMessage("");
  };

  // Cerrar modal
  const closeModal = () => setShowModal(false);

  const confirmFinal = (value) => {
    const estado = value === "si" ? "asistira" : "no_asistira";

    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}/confirmar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmacion: estado,
        pases: value === "si" ? pasesUsados : 0,
      }),
    })
      .then(res => res.json())
      .then((infoActualizada) => {

        // ⭐⭐ ACTUALIZA EN TIEMPO REAL ⭐⭐
        setData(infoActualizada);

        if (value === "si") {
          setShowQRSection(true);
          setFinalMessage("¡Qué alegría saber que nos acompañarás!");
        } else {
          setShowQRSection(false);
          setFinalMessage("Lamentamos que no puedas acompañarnos 💕");
        }

        setStep(3);
      })
      .catch(err => console.log(err));
  };


  useEffect(() => {
    if (!id) return;

    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}`)
      .then(res => res.json())
      .then(info => {
        setData(info);

        // 🔥 Si ya confirmó, mostrar QR
        if (info.confirmacion === "asistira") {
          setShowQRSection(true);
        }
      })
      .catch(err => console.error(err));
  }, [id]);




  // Confirmar respuesta
  const confirmSelection = () => {
    if (!selection) return alert("Por favor selecciona una opción.");

    const estado = selection === "si" ? "asistira" : "no_asistira";

    // 🚀 Enviar al backend
    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}/confirmar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmacion: estado }),
    })
      .then(res => res.json())
      .then(() => {
        // Mensajes bonitos
        if (selection === "si") {
          setFinalMessage(
            "¡Qué alegría saber que nos acompañarás! Será un honor compartir este día tan especial contigo."
          );
        } else {
          setFinalMessage(
            "Lamentamos que no puedas acompañarnos, pero agradecemos mucho tu atención y cariño. 💕"
          );
        }
      })
      .catch(err => console.log(err));
  };

  const cancelarConfirmacion = () => {
    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}/confirmar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmacion: "pendiente",
        pases: data.pases, // restaurar pases originales
      }),
    })
      .then(res => res.json())
      .then(info => {
        setData(info);
        setShowQRSection(false); // ❌ ocultar QR
        setStep(1); // reiniciar modal
        alert("Tu confirmación ha sido cancelada.");
      })
      .catch(err => console.log(err));
  };




  // sonido 
  // sonido 
  useEffect(() => {
    const unlock = () => {
      if (!audioRef.current) return;

      audioRef.current.volume = 0.25;

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
    };

    // iOS + Android
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("pointerdown", unlock, { once: true });

    // 🔥 Fallback especial para Android Chrome
    setTimeout(() => {
      audioRef.current?.play().catch(() => { });
    }, 1200);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);









  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-animate");
          }
        });
      },
      { threshold: 0.2 } // se activa cuando 20% del elemento ya es visible
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section2 = document.querySelector(".section2");

    // Solo animaremos el invite-name
    const inviteName = document.querySelector(".invite-name");

    // Ocultar inicialmente
    inviteName.classList.add("animate-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {

            inviteName.classList.add("animate");
            inviteName.classList.remove("animate-hidden");

          }
        });
      },
      { threshold: 0.3 } // se activa cuando el 30% de la sección es visible
    );

    if (section2) observer.observe(section2);

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    /* ============================
       SECCIÓN 3 — COUNTDOWN
    ============================ */

    const section3 = document.querySelector(".section3");

    // Selecciona únicamente las cajas
    const targets3 = document.querySelectorAll(".count-box");

    // Estado inicial: oculto
    targets3.forEach((el) => el.classList.add("animate-hidden"));

    // Observer exclusivo de sección 3
    const observer3 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            targets3.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate");
                el.classList.remove("animate-hidden");
              }, index * 300); // Entradas escalonadas elegantes
            });
          }
        });
      },
      { threshold: 0.3 } // Se activa cuando el 30% se vea
    );

    if (section3) observer3.observe(section3);

    return () => observer3.disconnect();
  }, []);

  useEffect(() => {
    /* ============================
       SECCIÓN 6 — Versículo
    ============================ */

    const section6 = document.querySelector(".section6-verse");

    // Ocultar inicialmente
    section6.classList.add("animate-hidden");

    const observer6 = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section6.classList.add("animate");
            section6.classList.remove("animate-hidden");
          }
        });
      },
      { threshold: 0.3 }
    );

    observer6.observe(section6);

    return () => observer6.disconnect();
  }, []);

  useEffect(() => {
    /* ============================
       SECCIÓN 13 — Nombre
    ============================ */

    const section13Name = document.querySelector(".section13-name");

    // Oculta primero
    section13Name.classList.add("animate-hidden");

    const observer13 = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section13Name.classList.add("animate");
            section13Name.classList.remove("animate-hidden");
          }
        });
      },
      { threshold: 0.3 } // Se activa cuando 30% es visible
    );

    observer13.observe(section13Name);

    return () => observer13.disconnect();
  }, []);

  useEffect(() => {
    const verso = document.querySelector(".s15-verso");
    const cita = document.querySelector(".s15-cita");

    [verso, cita].forEach(el => el.classList.add("animate-hidden"));

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            verso.classList.add("animate");
            verso.classList.remove("animate-hidden");

            cita.classList.add("animate");
            cita.classList.remove("animate-hidden");
          }
        });
      },
      { threshold: 0.3 }
    );

    const section15 = document.querySelector(".section15");
    if (section15) observer.observe(section15);

    return () => observer.disconnect();
  }, []);






  // ============================
  // 💍 PADRINOS
  // ============================
  const padrinos = [
    { rol: "Ramo", nombre1: "Sarai Urbiña Brena", icon: ramo },
    { rol: "Arras", nombre1: "Saúl Cosmes Jiménez", nombre2: "Marlen Castellanos Serret", icon: arras2 },
    { rol: "Anillos", nombre1: "Juan José Audelo Luria", nombre2: "Andrea Castellanos Serret", icon: anillos },
    { rol: "Biblia", nombre1: "David Cruz López", nombre2: "Judit Cruz Álvarez", icon: biblia },
    { rol: "Cojines", nombre1: "Guillermo Zarate López", nombre2: "Edith Victoria de Zarate", icon: cojin },
    { rol: "Lazo", nombre1: "Rosa Serret Miguel", nombre2: "Jesus Hernández López", icon: lazo },
    { rol: "Brindis", nombre1: "Manuel Urbiña Brena", nombre2: "Daniela Domínguez Alemán", icon: brindis },
  ]

  const [index, setIndex] = useState(0)
  const handlePrev = () => setIndex((prev) => (prev - 1 + padrinos.length) % padrinos.length)
  const handleNext = () => setIndex((prev) => (prev + 1) % padrinos.length)

  return (
    <div className="scroll-container">

      {/* 🎵 AUDIO INVISIBLE */}
      <audio
        ref={audioRef}
        src={music1}
        playsInline
        loop
      />






      {/* ================= SECCIÓN 1 ================= */}
      <section className="section section1">
        <img src={imag1} alt="Fondo completo" className="full-image" />

        {/* 🔘 BOTÓN PEGADO A SECCIÓN 1 */}
        <button className="music-btn" onClick={toggleMusic}>
          {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>

        <div className="text-overlay">
          <h1 className="title">Maricela & Hugo</h1>
          <p className="date">20 DICIEMBRE 2025</p>
        </div>
      </section>


      {/* ================= SECCIÓN 2 ================= */}
      <section className="section section2">
        <div className="section2-content">
          <img src={log1} alt="Logo M&H" className="section2-logo" />
          <h2 className="section2-title">Maricela & Hugo</h2>

          <p className="section2-text">
            "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor."
          </p>
          <br />
          <p className="section2-text">Corintios 13:13</p>

          <div className="invitation-card">
            <img src={sec2} alt="Decoración inferior" className="section2-image" />

            <div className="invite-overlay">
              <p className="invite-title">¡Es un placer invitarle!</p>
              <p className="invite-name">
                {id ? `${data?.abrev} ${data?.nombre}` : "Josue Urbiña Brena"}
              </p>


              <div className="invite-pass">
                <span className="invite-text">PASE PARA</span>
                <span className="invite-number">
                  {id ? data?.pases : "2"}
                </span>

                <span className="invite-text">PERSONAS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 3 ================= */}
      <section className="section section3">
        <img src={imag3} alt="Fondo cuenta regresiva" className="section3-image" />

        <div className="countdown-overlay">

          <div className="countdown-header">
            <h2 className="countdown-title">Para nuestra boda faltan…</h2>
            <p className="countdown-date">20 de diciembre del 2025</p>
          </div>

          <div className="countdown-boxes">
            <div className="count-box">
              <span className="count-number">{timeLeft.days}</span>
              <span className="count-label">Días</span>
            </div>
            <div className="count-box">
              <span className="count-number">{timeLeft.hours}</span>
              <span className="count-label">Hrs</span>
            </div>
            <div className="count-box">
              <span className="count-number">{timeLeft.minutes}</span>
              <span className="count-label">Mins</span>
            </div>
            <div className="count-box">
              <span className="count-number">{timeLeft.seconds}</span>
              <span className="count-label">Segs</span>
            </div>
          </div>

        </div>
      </section>


      {/* ================= SECCIÓN 4 ================= */}
      <section className="section section4">
        <div className="section4-content">
          <p className="section4-phrase">
            Tu compañía hara de este momento algo inolvidable.
          </p>

          <img src={sec4} alt="Decoración inferior" className="section4-image" />

          <div className="blessing-overlay">
            <p className="blessing-text">
              Con la bendición de Dios y <br /> de nuestros padres
            </p>

            <div className="parents-block bride-parents">
              <h3 className="parents-title">Padres de la novia</h3>
              <p className="parent-name">Sr. Manuel Urbiña Carrera</p>
              <p className="parent-name">Sra. Juana Brena Quitzamán</p>
            </div>

            <div className="parents-block groom-parents">
              <h3 className="parents-title">Padres del novio</h3>
              <p className="parent-name">Sr. Joel Hugo Castellanos Santiago</p>
              <p className="parent-name">Sra. Felicitas Serret Miguel</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 5 ================= */}
      <section className="section section5">
        <img src={imag2} alt="Decoración final" className="section5-image" />
      </section>

      {/* ================= SECCIÓN 6 ================= */}
      <section className="section section6">
        <div className="section6-card">
          <img src={sec6} alt="Tarjeta de padrinos" className="section6-card-img" />

          <div className="padrinos-overlay">
            <h2 className="padrino-title">Nuestros Padrinos</h2>
            <img src={padrinos[index].icon} alt={padrinos[index].rol} className="padrino-icon" />
            <h3 className="padrino-role">{padrinos[index].rol}</h3>
            <p className="padrino-name">{padrinos[index].nombre1}</p>
            {padrinos[index].nombre2 && <p className="padrino-name">{padrinos[index].nombre2}</p>}

            <button className="carousel-btn left-btn" onClick={handlePrev}>‹</button>
            <button className="carousel-btn right-btn" onClick={handleNext}>›</button>
          </div>

          <div className="section6-verse">
            <p className="verse-text">“Dios es amor; y el que permanece en amor, permanece en Dios.”</p>
            <p className="verse-ref">Juan 4:16</p>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 7 ================= */}
      <section className="section section7">
        <img src={imag4} alt="Imag4" className="section7-image" />
      </section>

      {/* ================= SECCIÓN 8 ================= */}
      <section className="section section8">
        <div className="itinerario-wrapper">
          <div className="itinerario-container">
            <h2 className="it-title">Itinerario</h2>

            <div className="it-item">
              <img src={icon1} className="it-icon" />
              <div className="it-text-block">
                <p className="it-title-text">Entrada al salón</p>
                <p className="it-hour-text">12:30 pm</p>
              </div>
              <div className="it-line"></div>
            </div>

            <div className="it-item">
              <img src={icon2} className="it-icon" />
              <div className="it-text-block">
                <p className="it-title-text">Ceremonia Religiosa</p>
                <p className="it-hour-text">13:00 pm</p>
              </div>
              <div className="it-line"></div>
            </div>

            <div className="it-item">
              <img src={icon3} className="it-icon" />
              <div className="it-text-block">
                <p className="it-title-text">Comida</p>
                <p className="it-hour-text">15:00 pm</p>
              </div>
              <div className="it-line"></div>
            </div>

            <div className="it-item">
              <img src={icon4} className="it-icon" />
              <div className="it-text-block">
                <p className="it-title-text">Fiesta</p>
                <p className="it-hour-text">16:00 pm</p>
              </div>
            </div>

          </div>

          <div className="mh-bar-text">M&H</div>
        </div>
      </section>

      {/* ================= SECCIÓN 9 ================= */}
      <section className="section section9">
        <div className="section9-card">
          <img src={sec6} alt="Decoración" className="section9-bg-image" />

          <h2 className="section9-title">Ubicación</h2>

          <h3 className="section9-salon">Salón La Ermita</h3>

          <img src={salonImg} alt="Salón" className="section9-salon-img" />

          <p className="section9-direccion">
            Carr. a Monte Albán 126, Vicente Suarez,<br />
            68156 Oaxaca de Juárez, Oax.
          </p>

          <a
            className="section9-btn"
            href="https://www.google.com/maps/place/Carr.+a+Monte+Alban+126,+Vicente+Suarez,+68156+Oaxaca+de+Ju%C3%A1rez,+Oax./?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a ubicación
          </a>
        </div>
      </section>

      {/* ================= SECCIÓN 10 ================= */}
      <section className="section section10">
        <div className="section10-card">
          <h2 className="section10-title">Mesa de Regalos</h2>

          <p className="section10-parrafo">
            Nuestro mejor regalo es compartir este día contigo.
            Pero si deseas tener un detalle con nosotros,
            hemos preparado una  mesa de regalos en:
          </p>

          <img src={liver} alt="Liverpool" className="regalo-icon" />

          <p className="section10-evento">No. Evento: 51659557</p>

          <a
            className="section10-btn"
            href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51659557"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a mesa
          </a>

          <img src={sobre2} alt="Sobre" className="sobre-icon" />

          <p className="section10-frase">
            "La lluvia de sobres, es la tradición de regalar dinero en efectivo<br />
            en un sobre el día del evento"
          </p>
        </div>

        <p className="section10-text">
          Su presencia llenará de alegría el día en que uniremos nuestras vidas.
        </p>

        <img src={imag5} alt="imagen decorativa" className="section10-img" />
      </section>

      {/* ================= SECCIÓN 11 ================= */}
      <section className="section section11">
        <div className="section11-card">
          <img src={sec11bg} alt="Decoración" className="section11-bg" />

          <h2 className="dress-title">Código<br />de Vestimenta</h2>

          <h3 className="dress-sub">Formal</h3>

          <div className="dress-icons">
            <img src={vesti} className="dress-icon" alt="Vestimenta" />
          </div>

          <p className="dress-text">
            Hombres: Traje Completo <br />
            Mujeres: Vestido Largo <br />
            <span className="dress-colors">(Colores ocupados: blanco y verde esmeralda)</span>
          </p>

        </div>
      </section>

      {/* ================= SECCIÓN 12 ================= */}
      <section className="section section12">
        <div className="section12-card">
          <img src={sec11bg} alt="Decoración" className="section12-bg" />

          <h2 className="section12-title">¡Recomendaciones!</h2>

          <div className="section12-text">
            <p>1. Seguir el código de vestimenta especificado en la invitación.</p>
            <p>2. Llegar al menos 15 minutos antes del inicio del evento.</p>
            <p>3. Confirmar su asistencia con anticipación.</p>
            <p>4. Evitar llevar acompañantes no incluidos.</p>
            <p>5. Seguir instrucciones del personal del evento.</p>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 13 ================= */}
      <section className="section section13">
        <img src={imag6} alt="Confirmación" className="section13-img-top" />

        <div className="section13-card">
          <img src={sec6} alt="Fondo tarjeta" className="section13-bg" />

          <h2 className="section13-title">Confirmación</h2>
          <p className="section13-sub">Apreciable</p>
          <p className="section13-name">
            {id ? `${data?.abrev} ${data?.nombre}` : "Joven. Josue Urbiña Brena"}
          </p>


          <p className="section13-text">
            Tu presencia es esencial para nosotros en este momento tan especial,
            por lo que te pedimos confirmar tu asistencia.
          </p>

          <button
            className="section13-btn-confirmar"
            onClick={() => {
              if (data?.confirmacion === "asistira") {
                cancelarConfirmacion();
              } else {
                openModal();
              }
            }}
          >
            {data?.confirmacion === "asistira"
              ? "CANCELAR CONFIRMACIÓN"
              : "CONFIRMAR ASISTENCIA"}
          </button>



          {/* 🌟 MODAL DE CONFIRMACIÓN */}
          {/* 🌟 MODAL DE CONFIRMACIÓN */}
          {showModal && (
            <div className="confirm-modal-overlay" onClick={closeModal}>
              <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>

                {/* PASO 1 → Elegir si asistirá */}
                {step === 1 && (
                  <>
                    <h2 className="modal-title">Confirmación de asistencia</h2>
                    <p className="modal-text">
                      {id ? `${data?.abrev} ${data?.nombre}` : "Estimado invitado"},
                      nos encantaría saber si podrás acompañarnos.
                    </p>

                    <div className="modal-options">

                      {/* 🔥 SI SU ESTADO ES "no_asistira": SOLO MOSTRAR "Sí asistiré" */}
                      {data?.confirmacion === "no_asistira" ? (
                        <button
                          className={`option-btn ${selection === "si" ? "selected" : ""}`}
                          onClick={() => {
                            setSelection("si");
                            setStep(2);
                          }}
                        >
                          Sí asistiré
                        </button>
                      ) : (
                        <>
                          {/* 🔥 Si NO ha elegido nada aún o si está pendiente: mostrar ambas opciones */}
                          <button
                            className={`option-btn ${selection === "si" ? "selected" : ""}`}
                            onClick={() => {
                              setSelection("si");
                              setStep(2);
                            }}
                          >
                            Sí asistiré
                          </button>

                          <button
                            className={`option-btn ${selection === "no" ? "selected" : ""}`}
                            onClick={() => {
                              setSelection("no");
                              confirmFinal("no");
                            }}
                          >
                            No podré asistir
                          </button>
                        </>
                      )}

                    </div>

                  </>
                )}

                {/* PASO 2 → Elegir cuántos pases usará */}
                {step === 2 && (
                  <>
                    <h2 className="modal-title">Cantidad de pases</h2>

                    <p className="modal-text">
                      Tienes asignados <strong>{data?.pases}</strong> pases.
                      ¿Cuántos utilizarás?
                    </p>

                    <input
                      type="number"
                      min="1"
                      max={data?.pases}
                      value={pasesUsados}
                      onChange={(e) => {
                        let value = parseInt(e.target.value);
                        if (value > data.pases) value = data.pases;
                        if (value < 1) value = 1;
                        setPasesUsados(value);
                      }}
                      className="pases-input"
                    />

                    <button
                      className="modal-confirm-btn"
                      onClick={() => confirmFinal("si")}
                    >
                      Confirmar pases
                    </button>
                  </>
                )}

                {/* PASO 3 → Mensaje final */}
                {step === 3 && (
                  <>
                    <h2 className="modal-title">¡Gracias!</h2>
                    <p className="modal-text final-text">{finalMessage}</p>

                    <button
                      className="modal-close-btn"
                      onClick={() => {
                        closeModal();
                        if (selection === "si") setShowQRSection(true);
                      }}
                    >
                      Cerrar
                    </button>

                  </>
                )}

              </div>
            </div>
          )}
        </div>
      </section>
      {/* ================= SECCIÓN QR DINÁMICA ================= */}
      {showQRSection && (
        <section className="section sectionQR">

          <h2 className="qr-title">Tu acceso</h2>

          <div className="qr-card">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://maricelayhugo2025.com/qr/${id}`}
              alt="QR de acceso"
              className="qr-image"
            />

            <p className="qr-text">
              Este será tu QR de entrada.<br />
              Muéstralo al llegar al salón.
            </p>
          </div>

        </section>
      )}


      {/* ================= SECCIÓN 14 ================= */}
      <section className="section section14">
        <img src={imag7} alt="Sección 14" className="section14-image" />
      </section>

      {/* ================= SECCIÓN 15 ================= */}
      <section className="section section15">
        <div className="s15-top">
          <p className="s15-verso">
            "Y serán una sola carne. Así que no son ya más dos, sino uno.<br />
            Por tanto, lo que Dios juntó, no lo separe el hombre."
          </p>
          <p className="s15-cita">Mateo 19:6</p>
        </div>

        <div className="s15-bottom">
          <p className="s15-copy">Copyright © 2025 | JUB</p>
        </div>
      </section>

    </div>
  )
}
