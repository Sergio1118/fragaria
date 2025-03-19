import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es"; 
import { Card, Button } from "react-bootstrap"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./cronograma.css"; 
import Navbaruser from "../Navbaruser/navbaruser";
import Footer from "../Footer/footer";

const Calendario_trabajador = () => {
  const [mostrarCompletadas, setMostrarCompletadas] = useState(false);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [mostrarIncompletas, setMostrarIncompletas] = useState(false);
  const [actividades, setActividades] = useState([]);

  const actividadGet = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/actividades_de_trabajador/", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      console.log("Datos de la API:", data.actividades);

      
      if (Array.isArray(data.actividades)) {
        const actividadesTransformadas = data.actividades.map((act) => ({
          fecha: act.fecha.split(" ")[0], // Fecha sin hora
          estado: act.estado,
          nombre_actividad: act.nombre_actividad || "Sin nombre", // Prevención de undefined
        }));
        setActividades(actividadesTransformadas);
      } else {
        console.error("Formato de respuesta incorrecto:", data);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }, []);

  useEffect(() => {
    actividadGet();
  }, []);

  const actividadesCompletas = actividades.filter(act => act.estado === "completada");
  const actividadesPendientes = actividades.filter(act => act.estado === "pendiente");
  const actividadesIncompletas = actividades.filter(act => act.estado === "incompleta");

  const eventosConColor = actividades.map((evento) => ({
    ...evento,
    title: evento.nombre_actividad,
    start: evento.fecha,
    end: evento.fecha_vencimiento,
    color: evento.estado === "completada" ? "#28a745" : evento.estado === "pendiente" ? "#ffc107" : "#dc3545",
  }));

//   const formatearFecha = (fecha) => {
//     const opciones = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(fecha).toLocaleDateString("es-ES", opciones);
//   };


  return (
    <div className="container_body">
      <div className="container mt-5">
        <Navbaruser/>
        <h2 className="text-center fw-bold mb-5 mt-5" style={{color: "#4b2215"}}>Cronograma</h2>
        <div className="row justify-content-center">
          <div className="col-md-8 mb-5">
            <Card className="shadow-sm p-3">
              <Card.Body>
                <Card.Title className="text-center fw-bold mb-3">📅 Cronograma de Actividades</Card.Title>
                <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" locale={esLocale} height="600px" contentHeight="auto" events={eventosConColor} />
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            {[{ titulo: "✅ Completadas", estado: mostrarCompletadas, setEstado: setMostrarCompletadas, lista: actividadesCompletas, color: "text-success" },
              { titulo: "⏳ Pendientes", estado: mostrarPendientes, setEstado: setMostrarPendientes, lista: actividadesPendientes, color: "text-warning" },
              { titulo: "❌ Incompletas", estado: mostrarIncompletas, setEstado: setMostrarIncompletas, lista: actividadesIncompletas, color: "text-danger" }
            ].map(({titulo, estado, setEstado, lista, color}, index) => (
              <Card key={index} className="shadow-sm border-0 mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className={`fw-bold ${color}`}>{titulo}</Card.Title>
                    <Button variant="outline-primary" size="sm" onClick={() => setEstado(!estado)}>
                      {estado ? "▲" : "▼"}
                    </Button>
                  </div>
                  {estado && (
                    <ul className="mt-2">
                      {lista.map((item, i) => (
                        <li key={i}>
                        <strong>{item.nombre_actividad}</strong><br />
                        📅 {item.fecha}
                      </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="footerContainer">
        <Footer/>
      </div>
    </div>
  );
};

export default Calendario_trabajador;
