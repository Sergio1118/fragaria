import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FromSigul from "./componts/fromSigul.jsx"; // Componente de registro
import FromLogin from "./componts/fromLogin.jsx"; // Componente de inicio de sesión

function App() {
  return (
    <Router>
      <nav>
        {/* Enlaces de navegación */}
        <Link to="/sigul">Registro</Link> {/* Ruta para el registro */}
        {" | "}
        <Link to="/login">Iniciar sesión</Link> {/* Ruta para el inicio de sesión */}
      </nav>

      <Routes>
        {/* Define las rutas y sus componentes */}
        <Route path="/sigul" element={<FromSigul />} /> {/* Ruta para el registro */}
        <Route path="/login" element={<FromLogin />} /> {/* Ruta para el inicio de sesión */}
      </Routes>
    </Router>
  );
}

export default App;
