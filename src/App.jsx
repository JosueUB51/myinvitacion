import './App.css'
import clickImage from './assets/clik.png'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/home') // 🔥 redirige a la vista Home
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
