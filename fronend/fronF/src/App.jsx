import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FromSigul from "./componts/fromSigul.jsx"; // Componente de registro
import FromLogin from "./componts/fromLogin.jsx"; // Componente de inicio de sesión
import "bootstrap/dist/css/bootstrap.min.css";
import PasswordRecuper from"./componts/passwordRecovery.jsx";



function App() {
  return (
    <Router>
      <div className="container-fluid p-3">
        <nav className="mb-4">
          {/* Enlaces de navegación */}
          <Link to="/sigul" className="btn btn-link">Registro</Link>
          {" | "}
          <Link to="/login" className="btn btn-link">Iniciar sesión</Link>
          {" | "}
          <Link to ="/password" className="btn btn-link">Recuperar contraseña</Link>
        </nav>

        <Routes>
          {/* Define las rutas y sus componentes */}
          <Route path="/sigul" element={<FromSigul />} /> {/* Ruta para el registro */}
          <Route path="/login" element={<FromLogin />} /> {/* Ruta para el inicio de sesión */}
          <Route path="/password" element={<PasswordRecuper/>} /> {/*Ruta para recuperar contraseña */}
        </Routes>
      </div>

    </Router>
  );
}

export default App;

