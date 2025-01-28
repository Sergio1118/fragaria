import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./dashboard.css"; // Archivo CSS personalizado
import LoginForm from "./fromLogin";
import Footer from "./footer"; // Importa el Footer

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/otra-interfaz"); // Redirige a otra interfaz
  };

  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Contenedor que ocupa el 100% de la altura disponible */}
      <div className="main-content">
        {/* Ilustración */}
        <div className="illustration-container me-5">
          <img
            src="imagenes/ilustracion.png"
            alt="Ilustración de bienvenida"
            className="img-fluid"
          />
        </div>

        {/* Formulario de inicio de sesión o Dashboard */}
        <div className="text-center">
          {!isLoggedIn ? (
            <LoginForm onLogin={handleLoginSuccess} />
          ) : (
            <div className="dashboard-content">
              <h1>Bienvenido al Dashboard</h1>
              <p>Aquí va el contenido principal de tu página de Dashboard.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer agregado aquí */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
