import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Actividades() {
  const [actividades, setActividades] = useState([
    { id: 1, nameActividad: "Tarea 1", estado: "pendiente", fecha: "2024-02-10" },
    { id: 2, nameActividad: "Tarea 2", estado: "pendiente", fecha: "2025-03-05" },
    { id: 3, nameActividad: "Tarea 3", estado: "completada", fecha: "2025-02-10" },
    { id: 4, nameActividad: "Tarea 4", estado: "pendiente", fecha: "2024-02-05" },
  ]);

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ fecha: "" });

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

  const habilitarEdicion = (actividad) => {
    setEditando(actividad.id);
    setEditData({ fecha: actividad.fecha });
  };

  const guardarEdicion = (id) => {
    const hoy = new Date().toISOString().split("T")[0];
    setActividades((prev) =>
      prev.map((act) =>
        act.id === id
          ? { ...act, fecha: editData.fecha, estado: editData.fecha >= hoy ? "pendiente" : "incompleta" }
          : act
      )
    );
    setEditando(null);
  };

  return (
    <div className="container mt-4">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#8B0000" }}>
            📌 Gestión de Actividades
        </h2>



      <div className="row">
        {/* Sección de actividades pendientes */}
        <div className="col-md-4">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-warning text-center mb-3">📌 Pendientes</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              {actividades.filter((act) => act.estado === "pendiente").map((act) => (
                <div key={act.id} className="card border-warning shadow-sm mb-3">
                  <div className="card-body text-center">
                    <h6 className="fw-bold">{act.nameActividad}</h6>
                    <p className="text-muted">📅 {act.fecha}</p>
                    <button className="btn btn-success btn-sm w-100" onClick={() => marcarComoCompletada(act.id)}>
                      ✅ Completar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sección de actividades incompletas */}
        <div className="col-md-4">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-danger text-center mb-3">❌ Incompletas</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              {actividades.filter((act) => act.estado === "incompleta").map((act) => (
                <div key={act.id} className="card border-danger shadow-sm mb-3">
                  <div className="card-body text-center">
                    <h6 className="fw-bold">{act.nameActividad}</h6>
                    <p className="text-muted">📅 {act.fecha}</p>
                    {editando === act.id ? (
                      <>
                        <input
                          type="date"
                          className="form-control mb-2"
                          value={editData.fecha}
                          onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                        />
                        <button className="btn btn-success btn-sm w-100" onClick={() => guardarEdicion(act.id)}>
                          Guardar
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-warning btn-sm w-100" onClick={() => habilitarEdicion(act)}>
                        ✏️ Editar Fecha
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sección de actividades completadas */}
        <div className="col-md-4">
          <section className="p-3 border rounded shadow-sm bg-light">
            <h4 className="text-success text-center mb-3">✅ Completadas</h4>
            <div className="overflow-auto" style={{ maxHeight: "400px" }}>
              {actividades.filter((act) => act.estado === "completada").map((act) => (
                <div key={act.id} className="card border-success shadow-sm mb-3">
                  <div className="card-body text-center">
                    <h6 className="fw-bold">{act.nameActividad}</h6>
                    <p className="text-muted">📅 {act.fecha}</p>
                    <span className="badge bg-success">Completada</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Actividades;









