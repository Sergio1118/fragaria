import { useState, useEffect } from "react";
import Navbaradmin from "../NavbarAdmin/Navadmin";
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
    input:{
        fontFamily: "'Montserrat', sans-serif"
    }
}

function Perfil() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/perfil/", {
      method: "GET",
      credentials: "include", // Para enviar cookies con la sesión
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setLastName(data.lastName);
        setEmail(data.email);
      })
      .catch((error) => console.error("Error al obtener perfil:", error));
  }, []);

  const handleUpdate = () => {
    fetch("http://127.0.0.1:8000/api/perfil/actualizar/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, lastName, email }),
    })
      .then((response) => response.json())
      .then(() => alert("Datos actualizados correctamente"))
      .catch((error) => console.error("Error al actualizar perfil:", error));
  };

  const handleLogout = () => {
    fetch("http://127.0.0.1:8000/logout/", { method: "POST", credentials: "include" })
      .then(() => {
        alert("Sesión cerrada");
        window.location.reload();
      })
      .catch((error) => console.error("Error al cerrar sesión:", error));
  };

  return (
    <div style={styles.container}>
        <div className="container mt-5">
            <Navbaradmin/>

            <div className="row g-4 mt-5 mb-5">
                {/* Card de datos del usuario */}
                <div className="col-md-6 ">
                    <div className="card p-4 shadow-sm bg-light ">
                        <h2 className="h4 mb-3 text-center fw-bold" style={{color: "#4b2215"}}>Editar Perfil</h2>
                        <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            style={styles.input} 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Nombre"
                        />
                        </div>
                        <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            style={styles.input} 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            placeholder="Apellido"
                        />
                        </div>
                        <div className="mb-3">
                        <input 
                            type="email" 
                            className="form-control"
                            style={styles.input} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Correo electrónico"
                        />
                        </div>
                        <button className="btn fw-bold  w-100" 
                        style={{backgroundColor: "#fad885", fontFamily: "'Montserrat', sans-serif", color: "#4b2215"}} onClick={handleUpdate}>
                        Actualizar Datos
                        </button>
                    </div>
                </div>

                {/* Card de cerrar sesión con imagen */}
                <div className="col-md-6">
                <div className="card p-4 shadow-sm text-center bg-light">
                    {/* Espacio para imagen */}
                    <img 
                        src="imagenes/perfiledit.png" 
                        alt="Perfil" 
                        className="rounded-circle mx-auto d-block" 
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button className="btn fw-bold w-100 mt-4"  
                    style={{backgroundColor:"#c65b4a", fontFamily: "'Montserrat', sans-serif", color: "#4b2215"}}onClick={handleLogout}>
                    Cerrar Sesión
                    </button>
                </div>
                </div>
            </div>
        </div>
        <div style={styles.footerContainer}>
            <Footer/>
        </div>
    </div>
  );
}

export default Perfil;
