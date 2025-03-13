import  { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import Navbaradmin from "../NavbarAdmin/Navadmin";
import Footer from "../Footer/footer";


const styles ={
  container: {
    minHeight: "100vh",
    minWidth: "100%", // <-- Aquí lo agregas
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, rgb(252, 234, 208), rgb(255, 222, 199))",
  },
  card:{
    borderRadius: "10px",
    border: "2px solid rgba(83, 83, 83, 0.2)",
  },
  footerContainer: {
    textAlign: "center",
    width: "100%",
    marginTop: "auto", 
  },
}

function Informes() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/informe/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        if (data && data.usuarios && Array.isArray(data.usuarios)) {
          setTrabajadores(data.usuarios); // Solo si es un array
        } else {
          console.error("La respuesta no tiene la estructura esperada:", data);
          setTrabajadores([]); // Asegura que el estado sea un array vacío si hay error
        }
      })
      .catch((error) => {
        console.error("Error al obtener los informes:", error);
        setTrabajadores([]); // Evita que trabajadores quede undefined en caso de error
      });
  }, []);
  


  return (
    <div style={styles.container}>
           <Navbaradmin/>
        
          <h2 className="text-center fw-bold mb-5" style={{ marginTop: "80px", color: "#4b2215", }}>📊 Actividades de Trabajadores</h2>
          {Array.isArray(trabajadores) && trabajadores.length > 0 ? (
              trabajadores.map((trabajador) => (
                <div key={trabajador.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-lg rounded-4 p-3 bg-white" style={styles.card}>
                    <div className="card-body text-center">
                      <h5 className="fw-bold" style={{ color: "#4b2215" }}>{trabajador.nombre}</h5>
                      <p className="text-muted small">{trabajador.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No hay trabajadores disponibles</p> // Mensaje si la lista está vacía
            )}                      
        <div style={styles.footerContainer}>
          <Footer/>
        </div>
      
    </div>
  );
}

export default Informes;