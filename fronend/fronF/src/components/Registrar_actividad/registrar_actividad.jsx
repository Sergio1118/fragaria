import { useState, useEffect } from "react";
import Navbaradmin from "../NavbarAdmin/Navadmin";
import Footer from "../Footer/footer";

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

const RegistroActividades = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actividad, setActividad] = useState({
    usuario: "",
    nombre: "",
    descripcion: "",
    tiempoEstimado: "",
    fechaEstimada: "",
    fechaVencimiento: "",
  });

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8000/gestion_usuarios/", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        console.log("Datos recibidos:", data);

        if (data && Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          setError("La respuesta no contiene un array de usuarios.");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setActividad({ ...actividad, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(actividad)

    // Validaciones antes de enviar
    if (!actividad.usuario || !actividad.nombre || !actividad.descripcion || !actividad.tiempoEstimado || !actividad.fechaEstimada || !actividad.fechaVencimiento) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    let tiempoEstimado = actividad.tiempoEstimado;

    if (tiempoEstimado) {
      const timeParts = tiempoEstimado.split(":");
      if (timeParts.length === 2) {
        tiempoEstimado = `${timeParts[0]}:${timeParts[1]}:00`;
      }
    }

    try {
      const response = await fetch("http://localhost:8000/asignar_actividad/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: actividad.usuario,
          actividad: actividad.nombre,
          descripcion: actividad.descripcion,
          tiempo_estimado: tiempoEstimado,
          fecha: actividad.fechaEstimada,
          fecha_vencimiento: actividad.fechaVencimiento,
        }),
      });

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        console.log("Respuesta del servidor:", data);

        if (data) {
          setSuccess("Actividad registrada con éxito.");
          setActividad({
            usuario: "",
            nombre: "",
            descripcion: "",
            tiempoEstimado: "",
            fechaEstimada: "",
            fechaVencimiento: "",
          });
        } 
      } catch (error) {
        setError(`Error en el servidor: ${responseText}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div style={styles.container}>
      <div className="container mt-5">
        <Navbaradmin />
        <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Registrar Actividad</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Seleccionar Usuario</label>
                <select className="form-select" name="usuario" onChange={handleChange} value={actividad.usuario} required>
                  <option value="">Seleccione un usuario</option>
                  {usuarios.length > 0 ? (
                    usuarios.map((user, index) => (
                      <option key={index} value={user.id}>
                        {user.first_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No hay usuarios disponibles</option>
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre de la Actividad</label>
                <input className="form-control" name="nombre" value={actividad.nombre} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" name="descripcion" value={actividad.descripcion} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Tiempo Estimado (Horas)</label>
                <input type="time" className="form-control" name="tiempoEstimado" value={actividad.tiempoEstimado} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha Estimada</label>
                <input type="date" className="form-control" name="fechaEstimada" value={actividad.fechaEstimada} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Vencimiento</label>
                <input type="date" className="form-control" name="fechaVencimiento" value={actividad.fechaVencimiento} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={!usuarios.length}>
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
      <div style={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};

export default RegistroActividades;
