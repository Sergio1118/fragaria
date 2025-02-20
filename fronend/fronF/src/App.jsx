import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboardprincipal/dashboard"; 
import FromSigul from "./components/Sign_in/fromSigul"; 
import FromLogin from "./components/Login/fromLogin.jsx"; 
import PasswordRecuper from "./components/Password/passwordRecovery.jsx"; 
import Actividades from"./components/actividade/actvidades.jsx";
import Password from"./components/Password/password.jsx";
import AgregarTrabajador from "./components/trabadore/trabajar.jsx"
import DashboardAdmin from "./components/Dash_admin/dash_admin.jsx";


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
          path="/"
          element={
            <>
              <Dashboard />
            </>
          }
        />

        <Route
          path="/dash"
          element={
            <>
              <DashboardAdmin />
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
        <Route
          path="/password"
          element={
            <>
              <Password />
            </>
          }
        />
         <Route
          path="/trabadores"
          element={
            <>
              <AgregarTrabajador/>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
