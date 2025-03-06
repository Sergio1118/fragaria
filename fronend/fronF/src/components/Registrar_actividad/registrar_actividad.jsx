import { useState, useEffect } from "react";
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
    footerContainer: {
        textAlign: "center",
        width: "100%",
        marginTop: "auto", 
    },
}

const RegistroActividades = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [actividad, setActividad] = useState({
    usuario: "",
    nombre: "",
    descripcion: "",
    tiempoEstimado: "",
    fechaEstimada: "",
    fechaVencimiento: "",
  });

  useEffect(() => {
    fetch("/api/usuarios/")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios", error));
  }, []);

  const handleChange = (e) => {
    setActividad({ ...actividad, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/actividades/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actividad),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al registrar actividad");
        }
        return response.json();
      })
      .then(() => alert("Actividad registrada con éxito"))
      .catch((error) => console.error(error));
  };

  return (
    <div style={styles.container}>
        <div className="container mt-5">
            <Navbaradmin/>
            <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                <h2 className="card-title text-center mb-4">Registrar Actividad</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label className="form-label">Seleccionar Usuario</label>
                    <select className="form-select" name="usuario" onChange={handleChange} required>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((user) => (
                        <option key={user.id} value={user.id}>{user.nombre}</option>
                        ))}
                    </select>
                    </div>
                    
                    <div className="mb-3">
                    <label className="form-label">Nombre de la Actividad</label>
                    <input className="form-control" name="nombre" onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="descripcion" onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                    <label className="form-label">Tiempo Estimado (Horas)</label>
                    <input type="number" className="form-control" name="tiempoEstimado" onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                    <label className="form-label">Fecha Estimada</label>
                    <input type="date" className="form-control" name="fechaEstimada" onChange={handleChange} required />
                    </div>
                    
                    <div className="mb-3">
                    <label className="form-label">Fecha de Vencimiento</label>
                    <input type="date" className="form-control" name="fechaVencimiento" onChange={handleChange} required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100">Guardar</button>
                </form>
                </div>
            </div>
        </div>
        <div style={styles.footerContainer}>
          <Footer/>
      </div>
    </div>
  );
};

export default RegistroActividades;
