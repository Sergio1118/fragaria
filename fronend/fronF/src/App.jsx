import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FromSigul from "./componts/fromSigul.jsx"; // Componente de registro
import FromLogin from "./componts/fromLogin.jsx"; // Componente de inicio de sesión
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";
=======
import PasswordRecuper from"./componts/passwordRecovery.jsx";
>>>>>>> 8f98e4e24ee238adc897d9120f2feb5adb918891

function App() {
  return (
    <Router>
      <div className="container-fluid p-3">
        <nav className="mb-4">
          {/* Enlaces de navegación */}
          <Link to="/sigul" className="btn btn-link">Registro</Link>
          {" | "}
          <Link to="/login" className="btn btn-link">Iniciar sesión</Link>
        </nav>

<<<<<<< HEAD
        <Routes>
          {/* Define las rutas y sus componentes */}
          <Route path="/sigul" element={<FromSigul />} /> {/* Ruta para el registro */}
          <Route path="/login" element={<FromLogin />} /> {/* Ruta para el inicio de sesión */}
        </Routes>
      </div>
=======
      <Routes>
        {/* Define las rutas y sus componentes */}
        <Route path="/sigul" element={<FromSigul />} /> {/* Ruta para el registro */}
        <Route path="/login" element={<FromLogin />} /> {/* Ruta para el inicio de sesión */}
        <Route path="/passwordRecovery" element={<PasswordRecuper />} />{/*reuta para la recuparacion de contraseña*/}
      </Routes>
>>>>>>> 8f98e4e24ee238adc897d9120f2feb5adb918891
    </Router>
  );
}

export default App;

