import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fromSigul.css';

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
    } else {
      setErrors({});
      alert("Registro exitoso.");
      console.log("Datos del formulario:", formData);
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div 
        className="card p-4 shadow-lg rounded-4" 
        style={{ 
          width: '450px', 
          background: 'linear-gradient(to right, #f4b183, #f8d8a8)', 
          borderTop: "5px solid #8B0000" 
        }}
      >
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#8B0000" }}>Registro</h2>
        <form>
          {["name", "surname", "email"].map(field => (
            <div key={field} className="mb-3">
              <input
                type={field === "email" ? "email" : "text"}
                className={`form-control border-2 rounded-pill ${errors[field] ? "is-invalid" : ""}`}
                style={{ borderColor: "#8B0000" }}
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
                style={{ borderColor: "#8B0000" }}
                placeholder={field === "confirmation" ? "Confirmar contraseña" : "Contraseña"}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle"
                style={{ top: "32%", border: "none", color: "#8B0000" }}
                onClick={() => togglePasswordVisibility(field)}
              >

                <i className={`fa ${showPasswords[field] ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
              {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
            </div>
          ))}

          <button 
            type="button" 
            className="btn w-100 rounded-pill fw-bold" 
            style={{ backgroundColor: "#8B0000", color: "white" }}
            onClick={handleValidations}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default FromSigul;





