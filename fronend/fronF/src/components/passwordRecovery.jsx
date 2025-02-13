import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


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

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      
    >
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px", background: 'linear-gradient(to right, #f4b183, #f8d8a8)', borderTop: "5px solid #8B0000" }}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />

        {currentForm === "emailForm" && (
          <>
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#8B0000" }}>Recuperación de contraseña</h2>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control border-2 rounded-pill ${errors.email ? "is-invalid" : "border-dark"}`}
                placeholder="Correo electrónico"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <button className="btn w-100 rounded-pill fw-bold" style={{ backgroundColor: "#8B0000", color: "#fff" }} onClick={handleEmailFormSubmit}>
              Continuar
            </button>
          </>
        )}

        {currentForm === "tokenForm" && (
          <>
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#8B0000" }}>Verificación del token</h2>
            <p className="text-center">Te hemos enviado un código a tu correo electrónico.</p>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control border-2 rounded-pill ${errors.token ? "is-invalid" : "border-dark"}`}
                placeholder="Código de verificación"
                onChange={(e) => handleInputChange("token", e.target.value)}
              />
              {errors.token && <div className="invalid-feedback">{errors.token}</div>}
            </div>
            <button className="btn w-100 rounded-pill fw-bold" style={{ backgroundColor: "#8B0000", color: "#fff" }} onClick={handleTokenFormSubmit}>
              Verificar
            </button>
          </>
        )}

        {currentForm === "passwordForm" && (
          <>
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#8B0000" }}>Nueva contraseña</h2>
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control border-2 rounded-pill ${errors.password ? "is-invalid" : "border-dark"}`}
                placeholder="Nueva contraseña"
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle"
                style={{ top: "30%", border: "none", color: "#8B0000" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showConfirmation ? "text" : "password"}
                className={`form-control border-2 rounded-pill ${errors.confirmation ? "is-invalid" : "border-dark"}`}
                placeholder="Confirmar contraseña"
                onChange={(e) => handleInputChange("confirmation", e.target.value)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle"
                style={{ top: "30%", border: "none", color: "#8B0000" }}
                onClick={() => setShowConfirmation(!showConfirmation)}
              >
                <i className={`fa ${showConfirmation ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
              {errors.confirmation && <div className="invalid-feedback">{errors.confirmation}</div>}
            </div>

            <button className="btn w-100 rounded-pill fw-bold" style={{ backgroundColor: "#8B0000", color: "#fff" }} onClick={handlePasswordFormSubmit}>
              Guardar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PasswordRecuper;


