import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbaradmin  from "../NavbarAdmin/Navadmin";
import Footer from "../Footer/footer";

const styles ={
  container: {
    minHeight: "100vh",
    minWidth: "100%", // <-- Aquí lo agregas
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, rgb(252, 234, 208), rgb(255, 222, 199))",
  },
    btnCustom: {
    backgroundColor: "#d17c53",
    color: "#ffff",
    border: "2px solid rgb(255, 185, 153)",
    padding: "10px 10px",
    borderRadius: "25px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    minWidth: "250px", // Aumenta el ancho mínimo del botón
    maxWidth: "300px", // Aumenta el ancho máximo
    marginTop: "100px",
  },
  card: {
    width: "90%",  // Por defecto, ocupará el 90% del ancho disponible
    maxWidth: "500px",  // Máximo de 900px en pantallas grandes
    minWidth: "250px",  // Mínimo de 250px en pantallas pequeñas
    margin: "30px auto", // Centrar la tarjeta horizontalmente
    background: "#ffff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    border: "1px solid rgba(83, 83, 83, 0.2)",
    padding: "20px",
  },
  input: {
    
    fontFamily: "'Montserrat', sans-serif", 
  },
  footerContainer: {
    textAlign: "center",
    width: "100%",
    marginTop: "auto", 
  },
}

const AgregarTrabajador = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [trabajadores, setTrabajadores] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  
    // Si el usuario empieza a escribir en un campo con error, eliminamos el mensaje de error
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const getCsrfToken = async () => {
    const response = await fetch("http://localhost:8000/obtener_token/", {
        credentials: "include",
    });

    if (!response.ok) {
        console.error("No se pudo obtener el token CSRF");
        return null;
    }

    const data = await response.json();
    console.log("Token CSRF obtenido:", data.csrfToken); // Verifica si el token aparece en consola
    return data.csrfToken;
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.surname) newErrors.surname = "El apellido es obligatorio";
    if (!formData.email) newErrors.email = "El correo es obligatorio";
    if (!validateEmail(formData.email)) newErrors.email = "El correo no es válido";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (formData.password !== formData.confirmation) {
        newErrors.confirmation = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
     // Obtener token CSRF antes de enviar el formulario
     const csrfToken = await getCsrfToken();
     if (!csrfToken) {
         alert("Error obteniendo el token CSRF");
         return;
     }
 

    if (Object.keys(newErrors).length === 0) {
        try {
            const response = await fetch("http://localhost:8000/api/agregar-usuario/", {  // ✅ Asegúrate de que la URL sea correcta
                method: "POST",
                credentials: "include",  // ✅ Permite enviar cookies de sesión
                headers: { "Content-Type": "application/json" , "X-CSRFToken": csrfToken,},
                body: JSON.stringify({
                  first_name: formData.name,  // Cambio aquí
                  last_name: formData.surname,  // Cambio aquí
                  email: formData.email,
                  password1: formData.password,
                  password2: formData.confirmation,
              }),
              
            });

            const data = await response.json(); // Obtener respuesta del backend

            if (!response.ok) {
                throw new Error(data.error || "Error al agregar el trabajador");
            }

            setTrabajadores([...trabajadores, data]); // Actualizar lista con el nuevo usuario
            setIsFormVisible(false);
            setFormData({ name: "", surname: "", email: "", password: "", confirmation: "" });

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    // Si no hay errores, actualizamos o añadimos el trabajador
    if (Object.keys(newErrors).length === 0) {
      const newTrabajadores = [...trabajadores];

      if (editIndex !== null) {
        // Actualizamos el trabajador con todos los campos
        newTrabajadores[editIndex] = {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password, // Agregamos la contraseña en la actualización
        };
      } else {
        // Añadimos un nuevo trabajador
        newTrabajadores.push({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password, // Añadimos la contraseña al nuevo trabajador
        });
      }

      setTrabajadores(newTrabajadores);
      setIsFormVisible(false);
      setFormData({ name: "", surname: "", email: "", password: "", confirmation: "" });
      setEditIndex(null); // Limpiamos el índice de edición
    }
  };

  const handleEdit = (index) => {
    setFormData({
      name: trabajadores[index].name,
      surname: trabajadores[index].surname,
      email: trabajadores[index].email,
      password: "", // Limpiamos la contraseña y confirmación al editar
      confirmation: "",
    });
    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este trabajador?")) {
      setTrabajadores(trabajadores.filter((_, i) => i !== index));
    }
  };
  const [showPasswords, setShowPasswords] = useState({ password: false, confirmation: false });
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div style={styles.container}>
        <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            />

      <div className="d-flex justify-content-center align-items-center" >

          <Navbaradmin/>
        
        <div className="d-flex justify-content-center">
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setEditIndex(null);
              setFormData({ name: "", surname: "", email: "", password: "", confirmation: "" });
            }}
            className="d-flex justify-content-center mb-2" style={styles.btnCustom}
          >
            {isFormVisible ? "Cancelar" : "Agregar trabajador"}
          </button>
        </div>

        {isFormVisible && (
          <div className="shadow-lg p-4 rounded-lg justify-content-center " style={styles.card}>
            <h3 className="mb-4 text-center text-gradient" style={{color: "#4b2215"}}>
              {editIndex !== null ? "Editar Trabajador" : "Registrar Trabajador"}
            </h3>
            <form onSubmit={handleSubmit}>
              {["name", "surname"].map((field) => (
                <div key={field} className="mb-4">
                  <input
                    type="text"
                    style={styles.input}
                    className="form-control"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)} // Asegúrate de que el cambio se maneje
                    disabled={editIndex !== null && field !== "name" && field !== "surname"} // Solo se deshabilita si estamos editando
                  />
                </div>
              ))}

              <div className="mb-4">
                <input
                  type="email"
                  style={styles.input}
                  className={`form-control  ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {["password", "confirmation"].map((field) => (
                <div key={field} className="mb-4 position-relative">
                  <input
                    style={styles.input}
                    type={showPasswords[field] ? "text" : "password"}
                    className={`form-control  ${errors[field] ? "is-invalid" : ""}`}
                    placeholder={field === "confirmation" ? "Confirmar contraseña" : "Contraseña"}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                  {/* Mostrar el icono solo si hay texto en el campo y no hay error */}
                  {formData[field] && !errors[field] && (
                    <button
                      type="button"
                      className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle"
                      style={{ top: "50%", border: "none", color: "#7d3c2a" }}
                      onClick={() => togglePasswordVisibility(field)}
                    >
                      <i className={`fa ${showPasswords[field] ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  )}
                  {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                </div>
              ))}

              <button type="submit" className="btn btn-gradient w-100 mt-3 py-2 fw-bold btn-sm" 
                      style={{ 
                      color: "#ffff", 
                      fontFamily: "'Montserrat', sans-serif", 
                      backgroundColor: "#d17c53", 
                      borderRadius: "10px",
                      border: "2px solid rgb(255, 185, 153)", }}>
                {editIndex !== null ? "Actualizar" : "Registrar"}
              </button>
            </form>
          </div>
        )}

                
          <div className="container mt-3 mb-5"> {/* Contenedor para evitar que las tarjetas queden pegadas a los márgenes */}
            <h3 className="mb-4 text-center text-gradient" style={{ color: "#4b2215", marginTop: "10px"}}>
              Trabajadores Registrados
            </h3>
            {trabajadores.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 "> {/* Separación entre tarjetas */}
                {trabajadores.map((trabajador, index) => (
                  <div key={index} className="col">
                    <div className="card shadow-lg h-100 rounded-lg p-3 " style={{ backgroundColor: "#f5f5f5",minWidth:"200px"}}>
                      <div className="card-body">
                        <h5 className="card-title text-center" style={{color: "#4b2215"}}>
                          {trabajador.name} {trabajador.surname}
                        </h5>
                        <p className="card-text text-muted text-center">{trabajador.email}</p>
                        <div className="d-flex justify-content-center gap-2"> {/* Espacio entre botones */}
                          <button onClick={() => handleEdit(index)} className="btn fw-bold " 
                            style={{backgroundColor: "#fad885", 
                                    fontFamily: "'Montserrat', sans-serif",}}>
                            Editar
                          </button>
                          <button onClick={() => handleDelete(index)} className="btn fw-bold " 
                            style={{backgroundColor:"#c65b4a", 
                                    fontFamily: "'Montserrat', sans-serif",}}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center " style={{ color: "#4b2215"}}>No hay trabajadores registrados.</p>
            )}
          </div>
      </div>
      <div style={styles.footerContainer}>
          <Footer/>
      </div>
    </div>
  );
};

export default AgregarTrabajador;
