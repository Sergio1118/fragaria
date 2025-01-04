import { useState } from 'react'; // Importa el hook useState de React para manejar el estado
import './fromSigul.css'; // Importa el archivo de estilos CSS para el formulario

function FromSigul() {
  // Estado para almacenar los datos del formulario (nombre, apellido, correo, contraseña, confirmación)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  // Estado para almacenar los mensajes de error en cada campo del formulario
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  // Estados para mostrar u ocultar las contraseñas en los campos
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Función para manejar los cambios en los campos de entrada del formulario
  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Función para validar el formato del correo electrónico
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correo electrónico
    return emailRegex.test(email); // Retorna true si el correo es válido
  };

  // Función para validar los campos del formulario antes de enviar
  const handleValidations = () => {
    let formErrors = {}; // Objeto para almacenar los errores de validación

    const { name, surname, email, password, confirmation } = formData;

    // Verifica que los campos no estén vacíos
    if (!name) formErrors.name = "Es obligatorio.";
    if (!surname) formErrors.surname = "Es obligatorio.";
    if (!email) formErrors.email = "Es obligatorio.";
    if (!password) formErrors.password = "Es obligatoria.";
    if (!confirmation) formErrors.confirmation = "Es obligatoria.";

    // Valida el formato del correo electrónico
    if (email && !isValidEmail(email)) {
      formErrors.email = "Correo electrónico no válido.";
    }

    // Verifica que las contraseñas coincidan
    if (password && confirmation && password !== confirmation) {
      formErrors.confirmation = "Las contraseñas no coinciden.";
    }

    // Si hay errores, actualiza el estado de los errores
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Si no hay errores, limpia los errores y muestra un mensaje de éxito
      setErrors({});
      alert("Registro exitoso.");
      console.log("Datos del formulario:", formData); // Muestra los datos del formulario en la consola
    }
  };

  return (
    <>
      <div className="background-container">
        <div className="form-container">
          {/* Enlace al archivo de íconos Font Awesome para mostrar los íconos de ojo */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
          <h1>Registro</h1>
          <div className="form">
            {/* Campo para el nombre */}
            <div className="input-container">
              <input
                type="text"
                placeholder="Nombre"
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "input-error" : ""} // Aplica la clase de error si hay error
              />
              {errors.name && <p className="error">{errors.name}</p>} {/* Muestra el mensaje de error si existe */}
            </div>

            {/* Campo para el apellido */}
            <div className="input-container">
              <input
                type="text"
                placeholder="Apellido"
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className={errors.surname ? "input-error" : ""}
              />
              {errors.surname && <p className="error">{errors.surname}</p>}
            </div>

            {/* Campo para el correo electrónico */}
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* Campo para la contraseña */}
            <div className="input-container password-container">
              <input
                type={showPassword ? "text" : "password"} // Muestra u oculta la contraseña según el estado
                placeholder="Contraseña"
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Alterna entre mostrar/ocultar la contraseña
                className="toggle-password-btn"
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} /> {/* Ícono para mostrar/ocultar */}
              </button>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {/* Campo para la confirmación de la contraseña */}
            <div className="input-container password-container">
              <input
                type={showConfirmation ? "text" : "password"}
                placeholder="Confirmación contraseña"
                onChange={(e) => handleInputChange("confirmation", e.target.value)}
                className={errors.confirmation ? "input-error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)} // Alterna entre mostrar/ocultar la confirmación
                className="toggle-password-btn"
              >
                <i className={`fa ${showConfirmation ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
              {errors.confirmation && <p className="error">{errors.confirmation}</p>}
            </div>

            {/* Botón para enviar el formulario */}
            <button className="submit-btn" onClick={handleValidations}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FromSigul;








