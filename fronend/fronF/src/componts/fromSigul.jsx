import { useState } from 'react';
import './fromSigul.css';



function FromSigul() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseñas
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidations = () => {
    let formErrors = {};
    const { name, surname, email, password, confirmation } = formData;

    if (!name) formErrors.name = "Es obligatorio.";
    if (!surname) formErrors.surname = "Es obligatorio.";
    if (!email) formErrors.email = "Es obligatorio.";
    if (!password) formErrors.password = "Es obligatoria.";
    if (!confirmation) formErrors.confirmation = "Es obligatoria.";

    if (email && !isValidEmail(email)) {
      formErrors.email = "Correo electrónico no válido.";
    }

    if (password && confirmation && password !== confirmation) {
      formErrors.confirmation = "Las contraseñas no coinciden.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      alert("Registro exitoso.");
      console.log("Datos del formulario:", formData);
    }
  };

  return (
    <>
      
      <div className="background-container">
        <div className="form-container">
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
            <h1>Registro</h1>
            <div className="form">
            <div className="input-container">
                <input
                type="text"
                placeholder="Nombre"
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "input-error" : ""}
                />
                {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="input-container">
                <input
                type="text"
                placeholder="Apellido"
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className={errors.surname ? "input-error" : ""}
                />
                {errors.surname && <p className="error">{errors.surname}</p>}
            </div>

            <div className="input-container">
                <input
                type="email"
                placeholder="Email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "input-error" : ""}
                />
                {errors.email && <p className="error">{errors.email}</p>}
            </div>

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
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="input-container password-container">
                <input
                type={showConfirmation ? "text" : "password"}
                placeholder="Confirmación contraseña"
                onChange={(e) => handleInputChange("confirmation", e.target.value)}
                className={errors.confirmation ? "input-error" : ""}
                />
                <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)}
                className="toggle-password-btn"
                >
                <i className={`fa ${showConfirmation ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
                {errors.confirmation && <p className="error">{errors.confirmation}</p>}
            </div>

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







