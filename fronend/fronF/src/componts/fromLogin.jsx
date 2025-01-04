import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./fromLogin.css" // Archivo CSS revisado

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleValidations = () => {
    const formErrors = {};
    const { email, password } = formData;

    if (!email) formErrors.email = "El correo electrónico es obligatorio.";
    else if (!isValidEmail(email)) formErrors.email = "Correo electrónico no válido.";

    if (!password) formErrors.password = "La contraseña es obligatoria.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      alert("Inicio de sesión exitoso.");
      console.log("Datos del formulario:", formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="form p-4">
        <h1 className="text-center mb-4">Iniciar Sesión</h1>
        <div className="form-group mb-3">
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="form-group mb-3 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
            rel="stylesheet"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
          >
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
          </button>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button className="btn btn-primary w-100" onClick={handleValidations}>
          Iniciar Sesión
        </button>
        <div className="text-center mt-3">
          {/* El enlace a la página de recuperación de contraseña */}
          <Link to="/passwordRecovery">Recuperar contraseña</Link>
        </div>
        <br />
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
