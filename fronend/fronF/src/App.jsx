import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboardprincipal/dashboard"; 
import FromSigul from "./components/Sign_in/fromSigul"; 
import FromLogin from "./components/Login/fromLogin.jsx"; 
import PasswordRecuper from "./components/Password/passwordRecovery.jsx"; 
<<<<<<< HEAD
=======
import Actividades from"./components/actividade/actvidades.jsx";
>>>>>>> 63089c3 (ya esta en backend)

function App() {
  
  return (
    <Router>
      {/* Navbar persistente en todas las páginas */}
      <Routes>
        <Route
          path="/registro"
          element={
            <>
              
              <FromSigul />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <FromLogin />
            </>
          }
        />
        <Route
          path="/recuperar"
          element={
            <>
              <PasswordRecuper />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <Dashboard />
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              <Dashboard />
            </>
          }
        />
         <Route
          path="/Actvidades"
          element={
            <>
              <Actividades />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
