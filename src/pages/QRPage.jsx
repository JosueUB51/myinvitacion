import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import './QRPage.css'

export default function QRPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`https://backend-boda-production-40aa.up.railway.app/api/invitaciones/${id}`)
      .then(res => res.json())
      .then(info => setData(info))
      .catch(err => console.log(err))
  }, [])

  if (!data) return <h2>Cargando...</h2>

  return (
    <div className="qr-check-container">
      <div className="qr-check-card">
        <h1>Invitación #{data.id}</h1>

        <h2>{data.abrev} {data.nombre}</h2>

        <p className="qr-check-pases">
          Pases autorizados: <strong>{data.pases}</strong>
        </p>

        <p className="qr-check-status">
          Estado: <span>{data.confirmacion === "asistira" ? "Asistencia confirmada" : "No confirmó"}</span>
        </p>

        <p className="qr-check-msg">✔ Acceso permitido</p>
      </div>
    </div>
  )
}
