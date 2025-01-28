import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importa el CSS de Bootstrap
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate para manejar la navegación
import "./fromLogin.css"; // Archivo CSS para el estilo del formulario

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleValidations = () => {
    const formErrors = {};
    const { email, password } = formData;

    if (!email) formErrors.email = "El correo electrónico es obligatorio.";
    else if (!isValidEmail(email)) formErrors.email = "Correo electrónico no válido.";

    if (!password) formErrors.password = "La contraseña es obligatoria.";
    else if (!isValidPassword(password)) formErrors.password = "La contraseña debe tener al menos 6 caracteres.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      alert("Inicio de sesión exitoso.");
      setFormData({ email: "", password: "" });
      navigate("/recuperar");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form p-4 shadow-sm rounded">
      <div className="text-center mb-3">
        <img
          src="imagenes/iconoFragaria.png"
          alt="Logo Fragaria"
          className="logo-fragaria"
          style={{ width: "80px", height: "80px" }}
        />
        <h1 className="mt-2 fragaria-text" style={{ fontSize: "1.5rem" }}>
          Fragaria
        </h1>
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleInputChange}
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          autoComplete="email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="form-group position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="eye-icon-btn position-absolute top-50 end-0 translate-middle-y border-0"
          style={{ color: "red" }}
        >
          <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
        </button>
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <button className="btn btn-login w-100 mb-3" onClick={handleValidations}>
        Iniciar Sesión
      </button>

      <div className="text-center mb-3">
        <Link to="/recuperar" className="text-decoration-none link-recovery">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className="text-center mb-3">
        <span>¿No tienes cuenta? </span>
        <Link to="/registro" className="text-decoration-none link-register">
          Regístrate ya
        </Link>
      </div>

      <div className="text-center">
        <span>
          Al registrarte, aceptas nuestros{" "}
          <Link to="/terminos-y-condiciones" className="text-decoration-none link-terms">
            Términos y Condiciones
          </Link>
          .
        </span>
      </div>
    </div>
  );
}

export default LoginForm;
