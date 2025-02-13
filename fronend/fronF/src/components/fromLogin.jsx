import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importa el CSS de Bootstrap
import { Link, useNavigate } from "react-router-dom"; // Para manejar la navegación
import "./fromLogin.css"; // Archivo CSS para los estilos personalizados


function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
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
      navigate("/inicio"); // Cambiar la ruta según sea necesario
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
    setShowPassword((prev) => !prev); // Alterna el estado de visibilidad de la contraseña
  };


  return (
    <>
      {/* Enlace de Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <div className="form1 p-4 shadow-sm rounded mx-auto">
  {/* Logo y título */}
        <div className="text-center mb-3">
          <img
            src="imagenes/iconoFragaria.png"
            alt="Logo Fragaria"
            className="logo-fragaria"
          />
          <h1 className="mt-2 fragaria-text">Fragaria</h1>
        </div>

        {/* Correo electrónico */}
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

        {/* Contraseña */}
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
            className="eye-icon-btn position-absolute top-50 translate-middle-y"
            onClick={togglePasswordVisibility}
          >
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
          </button>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {/* Botón de iniciar sesión */}
        <div className="form-group d-flex justify-content-between">
          <button className="btn btn-login" onClick={handleValidations}>
            Iniciar Sesión
          </button>
        </div>

        {/* Enlaces adicionales */}
        <div className="text-center mt-3">
          <Link to="/recuperar" className="link-recovery d-block mb-2">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/terminos" className="link-terms d-block mb-2">
            Términos y Condiciones
          </Link>
          <Link to="/registro" className="link-register d-block">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>


    </>
  );
}


export default LoginForm;



