import FromSigul from "./componts/fromSigul";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
    <nav>
      {/* Enlaces de navegación */}
      <Link to="/sigul">Registro</Link>
    </nav>
    
    <Routes>
      {/* Define las rutas y sus componentes */}
      <Route path="/sigul" element={<FromSigul/>} />
    </Routes>
  </Router>
  );
}

export default App;




