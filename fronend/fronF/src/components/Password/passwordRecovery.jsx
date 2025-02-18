import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Footer/footer";


function PasswordRecuper() {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    token: "",
    password: "",
    confirmation: "",
  });

  const [currentForm, setCurrentForm] = useState("emailForm");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "",
      }));
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailFormSubmit = () => {
    let formErrors = {};
    const { email } = formData;

    if (!email) {
      formErrors.email = "Es obligatorio.";
    } else if (!isValidEmail(email)) {
      formErrors.email = "Correo electrónico no válido.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setCurrentForm("tokenForm");
    }
  };

  const handleTokenFormSubmit = () => {
    let formErrors = {};
    const { token } = formData;

    if (!token) {
      formErrors.token = "Es obligatorio.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setCurrentForm("passwordForm");
    }
  };

  const handlePasswordFormSubmit = () => {
    let formErrors = {};
    const { password, confirmation } = formData;

    if (!password) {
      formErrors.password = "La contraseña es obligatoria.";
    }

    if (!confirmation) {
      formErrors.confirmation = "La confirmación es obligatoria.";
    } else if (password !== confirmation) {
      formErrors.confirmation = "Las contraseñas no coinciden.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      alert("Contraseña restablecida con éxito.");
    }
  };

  const styles = {
    
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
    body:{
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      background: "linear-gradient(to bottom,rgb(252, 234, 208),rgb(255, 222, 199))",
    }
  }
  return (
    <div style={styles.body}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <span style={styles.navbarTitle}>Fragaria</span>
      </nav>
  
      {/* Contenedor centrado */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px", background: 'linear-gradient(to right, #f4b183, #f8d8a8)',maxWidth: "85%" }}>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
  
          {currentForm === "emailForm" && (
            <>
              <h2 className="text-center mb-4 fw-bold" style={{ color: "#dc3545", }}>Recuperación de contraseña</h2>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control border-2 rounded-pill ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Correo electrónico"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <button className="btn w-100 rounded-pill fw-bold" style={{ backgroundColor: "#d17c53", color: "#fff" }} onClick={handleEmailFormSubmit}>
                Continuar
              </button>
            </>
          )}
  
          {currentForm === "tokenForm" && (
            <>
              <h2 className="text-center mb-4 fw-bold" style={{ color:" #dc3545" }}>Verificación del codigo</h2>
              <p className="text-center">Te hemos enviado un código a tu correo electrónico.</p>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control border-2 rounded-pill ${errors.token ? "is-invalid" : ""}`}
                  placeholder="Código de verificación"
                  onChange={(e) => handleInputChange("token", e.target.value)}
                />
                {errors.token && <div className="invalid-feedback">{errors.token}</div>}
              </div>
              <button className="btn w-100 rounded-pill fw-bold" style={{ backgroundColor:" #d17c53", color: "#fff" }} onClick={handleTokenFormSubmit}>
                Verificar
              </button>
            </>
          )}
  
          {currentForm === "passwordForm" && (
            <>
              <h2 className="text-center mb-4 fw-bold" style={{ color: " #dc3545" }}>Nueva contraseña</h2>
            <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control border-2 rounded-pill ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Nueva contraseña"
                  value={formData.password} 
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                  {formData.password && !errors.password && (
                  <button
                    type="button"
                    className={'btn position-absolute end-0 translate-middle-y me-3 rounded-circle ${errors.confirmation ? "is-invalid" : "border-dark"}'}
                    style={{ top: "45%", border: "none", color: "  #7d3c2a" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                )}
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
  
              <div className="mb-3 position-relative">
                <input
                  type={showConfirmation ? "text" : "password"}
                  className={`form-control border-2 rounded-pill ${errors.confirmation ? "is-invalid" : ""}`}
                  placeholder="Confirmar contraseña"
                  value={formData.confirmation}
                  onChange={(e) => handleInputChange("confirmation", e.target.value)}
                />
                {formData.confirmation && !errors.confirmation && (
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle"
                  style={{ top: "45%", border: "none", color:"   #7d3c2a" }}
                  onClick={() => setShowConfirmation(!showConfirmation)}
                >
                  <i className={`fa ${showConfirmation ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
                )}
                {errors.confirmation && <div className="invalid-feedback">{errors.confirmation}</div>}
              </div>
  
              <button className="btn w-100 rounded-pill fw-bold" style={{  backgroundColor:" #d17c53",  color: "#fff" }} onClick={handlePasswordFormSubmit}>
                Guardar
              </button>
            </>
          )}
        </div>
      </div>
        <div style={styles.footerContainer} className="mt-auto">
          <Footer />
        </div>
    </div>
    );
  }
  
  export default PasswordRecuper;  // <-- Asegúrate de exportar el componente correctamente
  