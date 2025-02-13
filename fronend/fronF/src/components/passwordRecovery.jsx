import { useState } from "react";

// Componente principal para la recuperación de contraseña
function PasswordRecuper() {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmation: "",
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({
    email: "",
    token: "",
    password: "",
    confirmation: "",
  });

  // Estado para alternar entre los formularios
  const [currentForm, setCurrentForm] = useState("emailForm");

  // Estado para mostrar u ocultar las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Maneja los cambios en los campos de entrada
  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    // Limpia los errores correspondientes al campo si ya hay datos válidos
    if (errors[key]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "",
      }));
    }
  };

  // Valida si el correo electrónico tiene un formato válido
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Maneja la validación y transición desde el formulario de correo electrónico
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
      setCurrentForm("tokenForm"); // Avanza al formulario de verificación del token
    }
  };

  // Maneja la validación y transición desde el formulario de token
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
      setCurrentForm("passwordForm"); // Avanza al formulario de nueva contraseña
    }
  };

  // Maneja la validación y envío del formulario de nueva contraseña
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
      // Aquí podrías redirigir al usuario o realizar alguna acción adicional
    }
  };

  // Renderiza el componente basado en el formulario actual
  return (
    <div className="background-container">
      <div className="form-container">
        {/* Importa íconos de Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        {/* Formulario para ingresar el correo electrónico */}
        {currentForm === "emailForm" && (
          <>
            <h1>Recuperación de contraseña</h1>
            <div className="form">
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <button className="submit-btn" onClick={handleEmailFormSubmit}>
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Formulario para verificar el token */}
        {currentForm === "tokenForm" && (
          <>
            <h1>Verificación del token</h1>
            <p>Te hemos enviado un código a tu correo electrónico.</p>
            <div className="form">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Token"
                  onChange={(e) => handleInputChange("token", e.target.value)}
                  className={errors.token ? "input-error" : ""}
                />
                {errors.token && <p className="error">{errors.token}</p>}
              </div>
              <button className="submit-btn" onClick={handleTokenFormSubmit}>
                Verificar
              </button>
            </div>
          </>
        )}

        {/* Formulario para establecer una nueva contraseña */}
        {currentForm === "passwordForm" && (
          <>
            <h1>Nueva contraseña</h1>
            <div className="form">
              {/* Campo para la contraseña */}
              <div className="input-container password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                >
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </button>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              {/* Campo para confirmar la contraseña */}
              <div className="input-container password-container">
                <input
                  type={showConfirmation ? "text" : "password"}
                  placeholder="Confirmación contraseña"
                  onChange={(e) =>
                    handleInputChange("confirmation", e.target.value)
                  }
                  className={errors.confirmation ? "input-error" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  className="toggle-password-btn"
                >
                  <i
                    className={`fa ${
                      showConfirmation ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </button>
                {errors.confirmation && (
                  <p className="error">{errors.confirmation}</p>
                )}
              </div>
              <button className="submit-btn" onClick={handlePasswordFormSubmit}>
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PasswordRecuper;