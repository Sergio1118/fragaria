import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboardprincipal/dashboard"; 
import FromSigul from "./components/Sign_in/fromSigul"; 
import FromLogin from "./components/Login/fromLogin.jsx"; 
import PasswordRecuper from "./components/Password/passwordRecovery.jsx"; 
import Actividades from"./components/Actividad/actvidades.jsx";
import Password from"./components/Password/password.jsx";
import AgregarTrabajador from "./components/Trabajadores/trabajar.jsx"
import DashboardAdmin from "./components/Dash_admin/dash_admin.jsx";
import Dashuser from "./components/Dash_user/dash_user.jsx";
import Plantacion from "./components/Plantacion/platacion.jsx";
import Informes from"./components/informe/info.jsx";
import Perfil from "./components/Perfil/perfil.jsx";
import RegistroActividades from "./components/Registrar_actividad/registrar_actividad.jsx";
import ActividadesT from "./components/actvidadesTrabajador/actvidadesT.jsx";
import Perfiluser from "./components/Perfiluser/perfiluser.jsx";
import Calendario from "./components/cronograma/cronogra.jsx";


function App() {
  
  return (
    <Router>
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
          path="/perfiladmin"
          element={
            <>
              
              <Perfil/>
            </>
          }
        />
          <Route
          path="/perfiluser"
          element={
            <>
              
              <Perfiluser/>
            </>
          }
        />


        <Route
          path="/"
          element={
            <>
              < Dashboard/>
            </>
          }
        />

        <Route
          path="/dashprincipal"
          element={
            <>
              < Dashboard/>
            </>
          }
        />


        <Route
          path="/dashadmin"
          element={
            <>
              <DashboardAdmin />
            </>
          }
        />

        
        <Route
          path="/dashuser"
          element={
            <>
              <Dashuser />
            </>
          }
        />
         <Route
          path="/actividad"
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
          path="/trabajador"
          element={
            <>
              <AgregarTrabajador/>
            </>
          }
        />
        <Route
          path="/plantacion"
          element={
            <>
              <Plantacion/>
            </>
          }
        />
        <Route
          path="/informes"
          element={
            <>
              <Informes/>
            </>
          }
        />
        <Route
          path="/registraractividad"
          element={
            <>
              
              <RegistroActividades/>
            </>
          }
        />
          <Route
          path="/ActividadesT"
          element={
            <>
              
              <ActividadesT/>
            </>
          }
        />
         <Route
          path="/cronograma"
          element={
            <>
              
              <Calendario/>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
