import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es"; // Idioma español
import { Card, Button } from "react-bootstrap"; // Bootstrap para las tarjetas
import "bootstrap/dist/css/bootstrap.min.css";

const Calendario = () => {
  const [mostrarCompletadas, setMostrarCompletadas] = useState(false);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [mostrarIncompletas, setMostrarIncompletas] = useState(false);
  const [mostrarPlantaciones, setMostrarPlantaciones] = useState(false);

  // Lista de eventos con estados y fechas
  const eventos = [
    { title: "Siembra de Trigo", start: "2025-03-05", end: "2025-03-10", estado: "completa" },
    { title: "Riego de Cultivos", start: "2025-03-12", end: "2025-03-15", estado: "pendiente" },
    { title: "Cosecha de Maíz", start: "2025-03-18", end: "2025-03-20", estado: "incompleta" },
  ];

  // Lista de plantaciones
  const plantaciones = [
    { title: "Plantación de Tomates", start: "2025-03-08" },
    { title: "Plantación de Papas", start: "2025-03-14" },
    { title: "Plantación de Zanahorias", start: "2025-03-22" },
  ];

  // Asignar color según el estado
  const eventosConColor = [
    ...eventos.map((evento) => ({
      ...evento,
      color: evento.estado === "completa" ? "#28a745" : evento.estado === "pendiente" ? "#ffc107" : "#dc3545",
    })),
    ...plantaciones.map((plantacion) => ({
      ...plantacion,
      color: "#007bff", // Azul para plantaciones
    })),
  ];

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="row w-100">
        {/* Calendario */}
        <div className="col-md-8">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Card.Title className="text-center fw-bold mb-3">📅 Calendario de Actividades</Card.Title>
              <div style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  locale={esLocale}
                  height="600px"
                  contentHeight="auto"
                  events={eventosConColor} // Eventos con colores por estado
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Tarjetas de Actividades */}
        <div className="col-md-4">
          {/* Tarjeta de Actividades Completadas */}
          <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="fw-bold text-success">✅ Completadas</Card.Title>
                <Button variant="outline-success" size="sm" onClick={() => setMostrarCompletadas(!mostrarCompletadas)}>
                  {mostrarCompletadas ? "▲" : "▼"}
                </Button>
              </div>
              {mostrarCompletadas && (
                <ul className="mt-2">
                  {eventos.filter((e) => e.estado === "completa").map((act, index) => (
                    <li key={index}>
                      <strong>{act.title}</strong> <br />
                      📅 {formatearFecha(act.start)} - {formatearFecha(act.end)}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Tarjeta de Actividades Pendientes */}
          <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="fw-bold text-warning">🟠 Pendientes</Card.Title>
                <Button variant="outline-warning" size="sm" onClick={() => setMostrarPendientes(!mostrarPendientes)}>
                  {mostrarPendientes ? "▲" : "▼"}
                </Button>
              </div>
              {mostrarPendientes && (
                <ul className="mt-2">
                  {eventos.filter((e) => e.estado === "pendiente").map((act, index) => (
                    <li key={index}>
                      <strong>{act.title}</strong> <br />
                      📅 {formatearFecha(act.start)} - {formatearFecha(act.end)}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Tarjeta de Actividades Incompletas */}
          <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="fw-bold text-danger">❌ Incompletas</Card.Title>
                <Button variant="outline-danger" size="sm" onClick={() => setMostrarIncompletas(!mostrarIncompletas)}>
                  {mostrarIncompletas ? "▲" : "▼"}
                </Button>
              </div>
              {mostrarIncompletas && (
                <ul className="mt-2">
                  {eventos.filter((e) => e.estado === "incompleta").map((act, index) => (
                    <li key={index}>
                      <strong>{act.title}</strong> <br />
                      📅 {formatearFecha(act.start)} - {formatearFecha(act.end)}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Tarjeta de Plantaciones */}
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="fw-bold text-primary">🌱 Plantaciones</Card.Title>
                <Button variant="outline-primary" size="sm" onClick={() => setMostrarPlantaciones(!mostrarPlantaciones)}>
                  {mostrarPlantaciones ? "▲" : "▼"}
                </Button>
              </div>
              {mostrarPlantaciones && (
                <ul className="mt-2">
                  {plantaciones.map((plant, index) => (
                    <li key={index}>
                      <strong>{plant.title}</strong> <br />
                      📅 Inicio: {formatearFecha(plant.start)}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendario;















