import  { useState } from "react";
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
  const trabajadores = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
      actividades: [
        { tarea: "Revisión de 5 máquinas industriales.", completado: "15 de Febrero de 2025" },
        { tarea: "Cambio de piezas desgastadas en 2 equipos.", completado: "18 de Febrero de 2025" },
        { tarea: "Pruebas de funcionamiento y ajustes finales.", completado: "20 de Febrero de 2025" }
      ]
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria.lopez@example.com",
      actividades: [
        { tarea: "Supervisó la producción de 3 turnos.", completado: "10 de Febrero de 2025" },
        { tarea: "Realizó 3 reportes de eficiencia.", completado: "12 de Febrero de 2025" },
        { tarea: "Coordinó la logística de insumos.", completado: "14 de Febrero de 2025" }
      ]
    }
  ];

  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);

  return (
    <div style={styles.container}>
           <Navbaradmin/>
          <div className="container mt-5">
          <h2 className="text-center fw-bold mb-5" style={{ marginTop: "80px", color: "#4b2215", }}>📊 Actividades de Trabajadores</h2>
          <div className="row justify-content-center">
            {trabajadores.map((trabajador) => (
              <div key={trabajador.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-lg  rounded-4 p-3 bg-white" style={styles.card}>
                  <div className="card-body text-center">
                    <h5 className="fw-bold " style={{color: "#4b2215"}}>{trabajador.nombre}</h5>
                    <p className="text-muted small">{trabajador.email}</p>

                    <button
                      className="btn w-100 rounded-pill mt-2"
                      style={{
                        backgroundColor: "#fad885",
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                      onClick={() =>
                        setTrabajadorSeleccionado(
                          trabajadorSeleccionado === trabajador.id ? null : trabajador.id
                        )
                      }
                    >
                     {trabajadorSeleccionado === trabajador.id ? <FaEyeSlash style={{ color: "#7d3c2a" }} /> : <FaEye style={{ color: "#7d3c2a", marginRight:"20px" }} />}
                      {trabajadorSeleccionado === trabajador.id ? "Ocultar Actividades" : "Ver Actividades" }
                    </button>

                    {trabajadorSeleccionado === trabajador.id && (
                      <div className="mt-4 p-3 bg-light rounded-3 shadow-sm text-start">
                        <p className="fw-bold">📌 Actividades realizadas:</p>
                        <ul className="list-group list-group-flush">
                          {trabajador.actividades.map((actividad, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <span><FaCheckCircle className="text-success me-2" /> {actividad.tarea}</span>
                              <small className="text-muted"><FaCalendarAlt /> {actividad.completado}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.footerContainer}>
          <Footer/>
      </div>
    </div>
    
  );
}

export default Informes;