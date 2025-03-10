import { useState, useEffect } from "react";
import Navbaradmin from "../NavbarAdmin/Navadmin";
import Footer from "../Footer/footer";

const styles = {
  plantacionContainer: {
    background: "linear-gradient(to bottom,rgb(252, 234, 208),rgb(255, 222, 199))",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    marginTop: "125px",
    width: "100%",
    overflowX: "hidden", 
    margin: 0,
    padding: 0,
  },
  formContainer: {
    margin: "0 auto 30px auto",  
    padding: "20px",
    backgroundColor: "#fff",  
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Montserrat', sans-serif",
    minWidth: "50%",
    maxWidth: "450px",
  },
  cardStyle: {
    margin: "0 auto",
    marginBottom: "60px",
    minWidth: "250px",
    maxWidth: "100px",
    padding: "20px",
  },
  btnCustom: {
    backgroundColor: "#d17c53",
    color: "#ffff",
    border: "2px solid rgb(255, 185, 153)",
    padding: "10px 20px",
    borderRadius: "25px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  btnCustomHover: {
    backgroundColor:"rgb(0, 0, 0)",
    color :" #552323",
    border: "2px solid rgb(255, 185, 153)",
  },
  footerContainer: {
    textAlign: "center",
    width: "100%",
    marginTop: "auto", 
  },
};

function Plantacion() {
  const [plantaciones, setPlantaciones] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechasRecomendadas, setFechasRecomendadas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [fechaPersonalizada, setFechaPersonalizada] = useState("");
  const [usarFechaPersonalizada, setUsarFechaPersonalizada] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [indiceEdicion, setIndiceEdicion] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const plantacionGet = async () => {
      try {
        const response = await fetch("http://localhost:8000/plantacion/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        if (response.ok) {
          setPlantaciones(data.plantaciones);
        } else {
          setError(data.message || "Error fetching profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile.");
      }
    };
    plantacionGet();
  }, []);


  useEffect(() => {
    const fecharecomrdat = async () => {
      try {
        const response = await fetch("http://localhost:8000/obtener_fechas_recomendadas/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        if (response.ok) {
          setFechasRecomendadas(data.fechas_recomendadas);
        } else {
          setError(data.message || "Error fetching profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile.");
      }
    };
    fecharecomrdat();
  }, []);

  const validarFormulario = () => {
    let erroresTemp = {};
    if (!nombre.trim()) erroresTemp.nombre = "El nombre es obligatorio.";
    if (!descripcion.trim()) erroresTemp.descripcion = "La descripción es obligatoria.";
    if (!usarFechaPersonalizada && !fechaSeleccionada && !editando) {
      erroresTemp.fecha = "Debe seleccionar una fecha.";
    }
    if (usarFechaPersonalizada && !fechaPersonalizada) {
      erroresTemp.fecha = "Debe ingresar una fecha personalizada.";
    }
    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const guardarPlantacion = async () => {
    if (!validarFormulario()) return;
  
    const fechaFinal = usarFechaPersonalizada ? fechaPersonalizada : fechaSeleccionada;
  
    const nuevaPlantacion = editando
      ? { ...plantaciones[indiceEdicion], nombre, descripcion, fecha: fechaFinal }
      : { nombre, descripcion, fecha: fechaFinal };
  
  
  
    // Al finalizar, actualizamos el estado de las plantaciones
    if (editando) {
      const id = plantaciones[indiceEdicion].id
      try {
        const response = await fetch(`http://localhost:8000/editar-plantacion/${id}/`, {
          method: "POST",
          credentials: "include", // enviar cookies
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: plantaciones[indiceEdicion].nombre,
            descripcion: plantaciones[indiceEdicion].descripcion,
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          alert("Plantación guardada correctamente.");
        } else {
          console.error("Error:", data.message || "Error al guardar la plantación.");
        }
      } catch (error) {
        console.error("Error al guardar la plantación:");
      }
      const nuevasPlantaciones = [...plantaciones];
      nuevasPlantaciones[indiceEdicion] = nuevaPlantacion;
      setPlantaciones(nuevasPlantaciones);
      setEditando(false);
      setIndiceEdicion(null);
    } else {
      try {
        const response = await fetch("http://localhost:8000/registrar_plantacion/", {
          method: "POST",
          credentials: "include", // enviar cookies
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nuevaPlantacion.nombre,
            descripcion: nuevaPlantacion.descripcion,
            fecha_siembra: nuevaPlantacion.fecha,
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          alert("Plantación guardada correctamente.");
        } else {
          console.error("Error:", data.message || "Error al guardar la plantación.");
        }
      } catch (error) {
        console.error("Error al guardar la plantación:");
      }
      setPlantaciones([...plantaciones, nuevaPlantacion]);
    }
  
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setFechaSeleccionada("");
    setFechaPersonalizada("");
    setUsarFechaPersonalizada(false);
    setImagen(null);
    setMostrandoFormulario(false);
    setErrores({});
  };

  const editarPlantacion = (index) => {
    const plantacion = plantaciones[index];
    setNombre(plantacion.nombre);
    setDescripcion(plantacion.descripcion);
    setImagen(plantacion.imagen);
    setFechaSeleccionada(plantacion.fecha);
    setEditando(true);
    setIndiceEdicion(index);
    setMostrandoFormulario(true);
  };

  const eliminarPlantacion = async (index) => {  // Marca la función como async
    const id = plantaciones[index].id;  // Usar index para obtener el id correcto
    try {
      const response = await fetch(`http://localhost:8000/eliminar-plantacion/${id}/`, {
        method: "POST",
        credentials: "include", // Enviar cookies si es necesario
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Plantación eliminada correctamente.");
        setPlantaciones(plantaciones.filter((_, i) => i !== index)); // Actualiza el estado eliminando la plantación
      } else {
        console.error("Error:", data.message || "Error al eliminar la plantación.");
      }
    } catch (error) {
      console.error("Error al eliminar la plantación:", error);
    }
  };

  return (
    <div style={styles.plantacionContainer}>
      <Navbaradmin />
      <div className="text-center" style={{ marginBottom: "30px", marginTop: "30px", color: "#4b2215" }}>
        <h2 className="text-center" style={{ marginBottom: "10px", marginTop: "90px", color: "#4b2215" }}>
          Gestión de Plantaciones
        </h2>
        <button
          style={styles.btnCustom}
          className="btn btn-custom px-4 py-2"
          onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
        >
          {mostrandoFormulario ? "Cerrar" : "Crear Nueva Plantación"}
        </button>
      </div>
      {mostrandoFormulario && (
        <div className="card p-3 mb-5" style={styles.formContainer}>
          <div className="mb-3">
            <label className="form-label">Nombre de la Plantación:</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción:</label>
            <textarea
              className="form-control"
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
            {errores.descripcion && <small className="text-danger">{errores.descripcion}</small>}
          </div>
          {!editando && (
            <div className="mb-3">
              <label className="form-label">Fecha de Siembra:</label>
              <select
                className="form-control mt-2"
                value={fechaSeleccionada}
                disabled={usarFechaPersonalizada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
              >
                <option value="">Selecciona una fecha</option>
                {fechasRecomendadas.map((fecha, index) => (
                  <option key={index} value={fecha}>
                    {fecha}
                  </option>
                ))}
              </select>
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={usarFechaPersonalizada}
                  onChange={(e) => setUsarFechaPersonalizada(e.target.checked)}
                />
                <label className="form-check-label">Usar fecha personalizada</label>
              </div>
              <input
                type="date"
                className="form-control mt-2"
                value={fechaPersonalizada}
                min={new Date().toISOString().split("T")[0]}
                disabled={!usarFechaPersonalizada}
                onChange={(e) => setFechaPersonalizada(e.target.value)}
              />
              {errores.fecha && <small className="text-danger">{errores.fecha}</small>}
            </div>
          )}
          <button style={styles.btnCustom} onClick={guardarPlantacion}>
            {editando ? "Actualizar" : "Guardar"} Plantación
          </button>
        </div>
      )}

      <div className="row">
        {plantaciones.map((plantacion, index) => (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card p-3 gap-2" style={styles.cardStyle}>
              <img
                src={plantacion.imagen || "imagenes/fresa2.jpg"}
                alt="Imagen de la Plantación"
                className="card-img-top"
                style={{ minHeight: "150px", objectFit: "cover" }}
              />
              <h5 className="mt-2">{plantacion.nombre}</h5>
              <p>{plantacion.descripcion}</p>
              <p style={{ color: "#4b2215" }}>
                <strong>Fecha de Siembra:</strong> {plantacion.fecha_siembra || plantacion.fecha}
              </p>
              <button
                className={"btn fw-bold "}
                style={{ backgroundColor: "#fad885", fontFamily: "'Montserrat', sans-serif" }}
                onClick={() => editarPlantacion(index)}
              >
                Editar
              </button>
              <button
                className={"btn fw-bold"}
                style={{ backgroundColor: "#c65b4a", fontFamily: "'Montserrat', sans-serif" }}
                onClick={() => eliminarPlantacion(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
}

export default Plantacion;
