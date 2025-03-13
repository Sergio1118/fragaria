import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbaradmin from "../NavbarAdmin/Navadmin";
import Footer from "../Footer/footer";
import RegistroActividades from "../Registrar_actividad/registrar_actividad";

const styles = {
  container: {
    minHeight: "100vh",
    minWidth: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, rgb(252, 234, 208), rgb(255, 222, 199))",
  },
  footerContainer: {
    textAlign: "center",
    width: "100%",
    marginTop: "auto",
  },
};

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ fecha: "", fecha_vencimiento: "" });

  
    const actividadGet = async () => {
      try {
        const response = await fetch("http://localhost:8000/actividadAdmin/", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error en la petición");
          actividadGet();

        const data = await response.json();

        if (Array.isArray(data.actividades)) {
          const actividadesTransformadas = data.actividades.map((act) => ({
            ...act,
            fecha: act.fecha.split(" ")[0], // Extraer solo la fecha (YYYY-MM-DD)
            fecha_vencimiento: act.fecha_vencimiento.split(" ")[0] || "", // Extraer fecha de vencimiento si existe
            usuario_nombre: act.usuario?.nombre || "Usuario desconocido", // Extraer el nombre del usuario
          }));

          setActividades(actividadesTransformadas);
        } else {
          console.error("Formato de respuesta incorrecto:", data);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    useEffect(() => {
      actividadGet();
    });
    
  const habilitarEdicion = (actividad) => {
    setEditando(actividad.id);
    setEditData({ fecha: actividad.fecha, fecha_vencimiento: actividad.fecha_vencimiento });
  };

  const guardarEdicion = (id) => {
    try {
      const actividad = actividades.find((act) => act.id === id);
      if (!actividad) {
        console.error("No se encontró la actividad.");
        return;
      }
  
      const response =  fetch(`http://localhost:8000/editar/${id}/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_vencimiento: editData.fecha_vencimiento,
          fecha: editData.fecha,
          estado: "incompleta",
        }),
      });
  
      if (!response.ok) {
        const errorData = response.json();
        console.error("Error en la respuesta del servidor:", errorData.message || "Error desconocido.");
        alert("Actividad guardada correctamente.");
        actividadGet();
        return;
      }
      setEditando(null);
    } catch (error) {
      console.error("Error al guardar la actividad:", error);
    }
    setEditando(null);
  };

  const eliminarActividad = (id) => {
    try {
      const response =  fetch(`http://localhost:8000/eliminar/${id}/`, {
        method: "POST",
        credentials: "include", // Enviar cookies si es necesario
        headers: { "Content-Type": "application/json" },
      });
  
      const data = response.json();
  
      if (response.ok) {
        alert("Plantación eliminada correctamente.");
        setActividades((prev) => prev.filter((act) => act.id !== id)); // Actualiza el estado eliminando la plantación
      } else {
        console.error("Error:", data.message || "Error al eliminar la plantación.");
      }
    } catch (error) {
      console.error("Error al eliminar la plantación:", error);
    }
    
  };

  return (
    <div style={styles.container}>
      <Navbaradmin />
      <div className="container-fluid mt-5">
        <h2 className="text-center fw-bold mt-5" style={{ color: "#4b2215", }}>
          📌 Gestión de Actividades
        </h2>
        <RegistroActividades/>
        <div className="row g-4">
          {["pendiente", "incompleta", "completada"].map((estado, index) => {
            const estadoInfo = {
              pendiente: { titulo: "📌 Pendientes", color: "#febd30", borde: "#f7dc6f" },
              incompleta: { titulo: "❌ Incompletas", color: "#c65b4a", borde: "#c65b4a" },
              completada: { titulo: "✅ Completadas", color: "#28b463", borde: "#1e8449" },
            };

            return (
              <div className="col-md-4 " key={index}>
                <section className="p-3 border rounded shadow bg-light mb-5">
                  <h4 className="text-center mb-3" style={{ color: estadoInfo[estado].color }}>
                    {estadoInfo[estado].titulo}
                  </h4>
                  <div className="overflow-auto" style={{ maxHeight: "400px" }}>
                    {actividades
                      .filter((act) => act.estado === estado)
                      .map((act) => (
                        <div key={act.id} className="card shadow-sm mb-3" style={{ border: `2px solid ${estadoInfo[estado].borde}` }}>
                          <div className="card-body text-center">
                            <h6 className="fw-bold text-dark">{act.nombre_actividad}</h6>
                            
                            <p className="text-muted">👤 Usuario: {act.first_name}</p>

                            {editando === act.id ? (
                              <>
                                <label className="form-label">📅 Fecha de actividad:</label>
                                <input
                                  type="date"
                                  className="form-control mb-2"
                                  value={editData.fecha}
                                  onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                                />
                                <label className="form-label">⏳ Fecha de vencimiento:</label>
                                <input
                                  type="date"
                                  className="form-control mb-2"
                                  value={editData.fecha_vencimiento}
                                  onChange={(e) => setEditData({ ...editData, fecha_vencimiento: e.target.value })}
                                />
                              </>
                            ) : (
                              <>
                                <p className="text-muted">📅 Fecha: {act.fecha}</p>
                                <p className="text-muted">⏳ Vence: {act.fecha_vencimiento || "No definida"}</p>
                              </>
                            )}

                            {estado !== "completada" && (
                              <>
                                {editando === act.id ? (
                                  <button className="btn btn-sm w-100 mb-2 btn-primary" onClick={() => guardarEdicion(act.id)}>
                                    💾 Guardar
                                  </button>
                                ) : (
                                  <>
                                    <button className="btn btn-sm w-100 btn-warning mb-2" onClick={() => habilitarEdicion(act)}>
                                      ✏️ Editar Fechas
                                    </button>
                                  </>
                                )}
                                <button className="btn btn-sm w-100 btn-danger" onClick={() => eliminarActividad(act.id)}>
                                  🗑️ Eliminar
                                </button>
                              </>
                            )}

                          {estado === "completada" && (
                            <>
                              <span className="badge bg-success text-dark">Completada</span>
                              <button className="btn btn-sm w-100 btn-danger mt-2" onClick={() => eliminarActividad(act.id)}>
                                🗑️ Eliminar
                              </button>
                            </>
                          )}
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div >
        <div  style={styles.footerContainer}>
            <Footer/>
        </div>
    </div>
  );
}

export default Actividades;
