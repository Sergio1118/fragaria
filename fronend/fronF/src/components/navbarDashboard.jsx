import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./NavbarDashboard.css"; // Estilos personalizados
import { useState } from "react";

function NavbarDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState); // Alternar estado
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            {/* Botón de hamburguesa */}
            <button
              className={`navbar-toggler ${isMenuOpen ? "menu-open" : ""}`}
              type="button"
              onClick={toggleMenu}
              aria-controls="navbarNav"
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label="Toggle navigation"
              >
              
              {isMenuOpen ? (
              <span className="close-icon">✖</span> // Ícono "X" para cerrar
              ) : (
              <span className="navbar-toggler-icon"></span> // Ícono de hamburguesa
              )}
            </button>


            {/* Marca (Fragaria) a la derecha */}
            <Link className="navbar-brand ms-auto" to="/">
              Fragaria
            </Link>
          </div>

          {/* Menú colapsable */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav flex-column ms-3">
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)} // Cerrar menú al hacer clic
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/registro"
                  onClick={() => setIsMenuOpen(false)} // Cerrar menú al hacer clic
                >
                  Registro
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)} // Cerrar menú al hacer clic
                >
                  Iniciar sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/recuperar"
                  onClick={() => setIsMenuOpen(false)} // Cerrar menú al hacer clic
                >
                  Recuperar contraseña
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default NavbarDashboard;
