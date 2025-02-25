import { NavLink } from "react-router-dom";

function Navbaradmin() {
  const styles = {
    navbar: {
      background: "linear-gradient(to right, #f4b183, #f8d8a8)",
      fontFamily: "'Montserrat', sans-serif",
    },
    brand: {
      fontWeight: "bold",
      color: "#dc3545",
    },
    link: {
      color: "#4b2215",
      fontWeight: "bold",
    },
    
  };

  return (
    <nav className="navbar navbar-expand-lg px-4" style={styles.navbar}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/dashprincipal" style={styles.brand}>
          <img
            src="imagenes/iconoFragaria.png"
            alt="Fragaria Logo"
            width="40"
            height="40"
            className="me-2"
          />
          Fragaria
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-4">
            <NavLink className="nav-link mx-2" to="/perfil" style={styles.link}>
              <img
                src="imagenes/usuario.png"
                alt="Perfil"
                width="30"
                height="30"
                className="me-1"
              />
              Perfil
            </NavLink>
            <NavLink
              className="nav-link mx-2"
              to="/cronograma"
              style={styles.link}
            >
              <img
                src="imagenes/calendario.png"
                alt="Cronograma"
                width="30"
                height="30"
                className="me-1"
              />
              Cronograma
            </NavLink>
            <NavLink className="nav-link mx-2" to="/trabajador" style={styles.link}>
              <img
                src="imagenes/trabajador.png"
                alt="Trabajadores"
                width="30"
                height="30"
                className="me-1"
              />
              Trabajadores
            </NavLink>
            <NavLink className="nav-link mx-2" to="/informes" style={styles.link}>
              <img
                src="imagenes/informe.png"
                alt="Informes"
                width="30"
                height="30"
                className="me-1"
              />
              Informes
            </NavLink>
            <NavLink className="nav-link mx-2" to="/actividad" style={styles.link}>
              <img
                src="imagenes/actividad.png"
                alt="Actividad"
                width="30"
                height="30"
                className="me-1"
              />
              Actividades
            </NavLink>
            <NavLink className="nav-link mx-2" to="/plantacion" style={styles.link}>
              <img
                src="imagenes/siembra.png"
                alt="Plantación"
                width="30"
                height="30"
                className="me-1"
              />
              Plantación
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbaradmin;
