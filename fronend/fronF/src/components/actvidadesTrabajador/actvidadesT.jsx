import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbaruser from "../Navbaruser/navbaruser";
import Footer from "../Footer/footer";

const styles={
  container: {
    minHeight: "100vh",
    minWidth: "100%", // <-- Aquí lo agregas
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, rgb(252, 234, 208), rgb(255, 222, 199))",
  },
  footerContainer: {
    textAlign: "center",
    width: "100%",
    marginTop: "auto", 
  },
}

function ActividadesT() {
  const [actividades, setActividades] = useState([
    { id: 1, nameActividad: "Tarea 1", estado: "pendiente", fecha: "2024-02-10" },
    { id: 2, nameActividad: "Tarea 2", estado: "pendiente", fecha: "2025-04-05" },
    { id: 3, nameActividad: "Tarea 3", estado: "completada", fecha: "2025-02-10" },
    { id: 4, nameActividad: "Tarea 4", estado: "pendiente", fecha: "2024-02-05" },
  ]);

 

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];

    setActividades((prev) =>
      prev.map((act) =>
        act.estado !== "completada"
          ? { ...act, estado: act.fecha < hoy ? "incompleta" : "pendiente" }
          : act
      )
    );
  }, []);

  const marcarComoCompletada = (id) => {
    setActividades((prev) =>
      prev.map((act) => (act.id === id ? { ...act, estado: "completada" } : act))
    );
  };

  

  return (
  <div style={styles.container}>
     <div className="container mt-5 mb-5">
         <Navbaruser/>
      <h2 className="text-center fw-bold mb-5 mt-5 d-flex justify-content-cente" style={{color: "#4b2215"}}>
        📌 Gestión de Actividades
      </h2>

      <div className="row g-4">
        {/* Sección de actividades pendientes */}
        <div className="col-md-4 ">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-center mb-3" 
                  style={{
                    color:"#febd30"}}>📌 Pendientes</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              {actividades
                .filter((act) => act.estado === "pendiente")
                .map((act) => (
                  <div key={act.id} className="card shadow-sm mb-3  " style={{border:"2px solid #f7dc6f "}}>
                    <div className="card-body text-center">
                      <h6 className="fw-bold"style={{ color: "#8B0000" }}>{act.nameActividad}</h6>
                      <p className="text-muted">📅 {act.fecha}</p>
                      
                      
                        <>
                          <button
                            className="btn btn-sm w-100 mb-2"
                            style={{backgroundColor: "#28b463", fontFamily: "'Montserrat', sans-serif" }}
                            onClick={() => marcarComoCompletada(act.id)} // Completar tarea
                          >
                            ✅ Completar
                          </button>
                        
                        </>
                      
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Sección de actividades incompletas */}
        <div className="col-md-4 ">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-center mb-3" style={{color: "#c65b4a"}}>❌ Incompletas</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              {actividades
                .filter((act) => act.estado === "incompleta")
                .map((act) => (
                  <div key={act.id} className="card shadow-sm mb-3" style={{border:" 2px solid #c65b4a"}}>
                    <div className="card-body text-center">
                      <h6 className="fw-bold" style={{ color: "#8B0000" }}>{act.nameActividad}</h6>
                      <p className="text-muted">📅 {act.fecha}</p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Sección de actividades completadas */}
        <div className="col-md-4">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-success text-center mb-3" >✅ Completadas</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px",   }}>
              {actividades
                .filter((act) => act.estado === "completada")
                .map((act) => (
                  <div key={act.id} className="card shadow-sm mb-3" style={{border:"2px solid #1e8449 "}}>
                    <div className="card-body text-center">
                      <h6 className="fw-bold" style={{ color: "#8B0000" }}>{act.nameActividad}</h6>
                      <p className="text-muted">📅 {act.fecha}</p>
                      <span className="badge" style={{backgroundColor:" #28b463", color:"rgb(0, 0, 0) " }}>Completada</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
      <div style={styles.footerContainer}>
          <Footer/>
      </div>
  </div>
  );
}

export default ActividadesT;