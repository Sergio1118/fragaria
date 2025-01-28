import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarDashboard from "./components/navbarDashboard.jsx"; 
import Dashboard from "./components/dashboard"; 
import FromSigul from "./components/fromSigul"; 
import FromLogin from "./components/fromLogin"; 
import PasswordRecuper from "./components/passwordRecovery.jsx"; 

function App() {
  
  return (
    <Router>
      {/* Navbar persistente en todas las páginas */}
      <Routes>
        <Route
          path="/registro"
          element={
            <>
              <NavbarDashboard />
              <FromSigul />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <NavbarDashboard />
              <FromLogin />
            </>
          }
        />
        <Route
          path="/recuperar"
          element={
            <>
              <NavbarDashboard />
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
      </Routes>
    </Router>
  );
}

export default App;
