import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../Footer/footer';

function FromSigul() {
  const [formData, setFormData] = useState({
    name: "", surname: "", email: "", password: "", confirmation: ""
  });

  const [errors, setErrors] = useState({
    name: "", surname: "", email: "", password: "", confirmation: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    password: false, confirmation: false
  });

  const handleInputChange = (key, value) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));

    // Elimina el mensaje de error si el usuario empieza a escribir
    setErrors(prevErrors => ({ ...prevErrors, [key]: "" }));
  };

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleValidations = () => {
    let formErrors = {};
    const { name, surname, email, password, confirmation } = formData;

    if (!name) formErrors.name = "Es obligatorio.";
    if (!surname) formErrors.surname = "Es obligatorio.";
    if (!email) formErrors.email = "Es obligatorio.";
    if (email && !isValidEmail(email)) formErrors.email = "Correo electrónico no válido.";
    if (!password) formErrors.password = "Es obligatoria.";
    if (!confirmation) formErrors.confirmation = "Es obligatoria.";
    if (password && confirmation && password !== confirmation) formErrors.confirmation = "Las contraseñas no coinciden.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Ocultar iconos si hay errores en las contraseñas
      if (formErrors.password || formErrors.confirmation) {
        setShowPasswords({ password: false, confirmation: false });
      }
    } else {
      setErrors({});
      alert("Registro exitoso.");
      console.log("Datos del formulario:", formData);
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  const styles = {
    body: {
      background: "linear-gradient(to bottom,rgb(252, 234, 208),rgb(255, 222, 199))",
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center"
    },
    navbar: {
      background: "linear-gradient(to right, #f4b183, #f8d8a8)",
      color: "white",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    navbarTitle: {
      flexGrow: 1.5,
      textAlign: "center",
      fontSize: "30px",
      fontWeight: "bold",
      fontFamily: "'Montserrat', sans-serif",
      color: "#dc3545",
      justifyContent: "center"
    },
    backButton: {
      background: "none",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      color: "#dc3545",
      marginLeft: "10px"
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh"
    },
    card: {
      width: '450px',
      background: 'linear-gradient(to right, #f4b183, #f8d8a8)',
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      maxWidth: "85%"
    },
    button: {
      backgroundColor: "#d17c53",
      color: "#ffff",
      width: "100%",
      borderRadius: "50px",
      fontFamily: "'Montserrat', sans-serif",
    },
    footerContainer: {
      flexShrink: 0,
    }
  };

  return (
    <div style={styles.body}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <span style={styles.navbarTitle}>Fragaria</span>
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
          <img 
            src="imagenes/iconoFragaria.png"
            alt="Logo Fragaria"
            className="logo-fragaria d-block mx-auto"
          />
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#dc3545" }}>Registro</h2>
          <form>
            {["name", "surname", "email"].map(field => (
              <div key={field} className="mb-3">
                <input
                  type={field === "email" ? "email" : "text"}
                  className={`form-control border-2 rounded-pill ${errors[field] ? "is-invalid" : ""}`}
                  placeholder={field === "email" ? "Correo electrónico" : field.charAt(0).toUpperCase() + field.slice(1)}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}

            {["password", "confirmation"].map(field => (
              <div key={field} className="mb-3 position-relative">
                <input
                  type={showPasswords[field] ? "text" : "password"}
                  className={`form-control border-2 rounded-pill ${errors[field] ? "is-invalid" : ""}`}
                  placeholder={field === "confirmation" ? "Confirmar contraseña" : "Contraseña"}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                {(formData[field] || formData.email) && (
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

            <button 
              type="button" 
              className="btn w-100 rounded-pill fw-bold" 
              style={styles.button}
              onClick={handleValidations}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>

      <div style={styles.footerContainer} className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default FromSigul;
