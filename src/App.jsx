import './App.css'
import clickImage from './assets/clik.png'
import { useNavigate, useLocation } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    // ejemplo: /invitacion/12 → ["", "invitacion", "12"]
    const parts = location.pathname.split("/")
    const id = parts[2]  // aquí viene el ID dinámico

    if (id) {
      // 🚀 llevar al Home real
      navigate(`/home/${id}`)
    } else {
      alert("No se encontró ID en la URL")
    }
  }

  return (
    <div className="home-container">
      <img
        src={clickImage}
        alt="Click aquí"
        className="click-image"
        onClick={handleClick}
      />
    </div>
  )
}

export default App
