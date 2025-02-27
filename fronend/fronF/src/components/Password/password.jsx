import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Password() {
  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePasswordFormSubmit = async () => {
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
      return;
    }

    setErrors({});
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/password-reset-confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña.");
      }

      setMessage("Contraseña restablecida con éxito.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(to bottom, rgb(252, 234, 208), rgb(255, 222, 199))", }}>
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px",  maxWidth: "85%" }}>
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#dc3545" }}>
            Nueva contraseña
          </h2>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control border-2 rounded-pill ${errors.password ? "is-invalid" : ""}`}
              placeholder="Nueva contraseña"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <button
              type="button"
              className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle border-dark"
              style={{ top: "50%", transform: "translateY(-50%)", border: "none", color: "#7d3c2a" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
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
            <button
              type="button"
              className="btn position-absolute end-0 translate-middle-y me-3 rounded-circle border-dark"
              style={{ top: "50%", transform: "translateY(-50%)", border: "none", color: "#7d3c2a" }}
              onClick={() => setShowConfirmation(!showConfirmation)}
            >
              👁
            </button>
            {errors.confirmation && <div className="invalid-feedback">{errors.confirmation}</div>}
          </div>

          {message && <div className="alert alert-info text-center">{message}</div>}

          <button
            className="btn w-100 rounded-pill fw-bold"
            style={{ backgroundColor: "#d17c53", color: "#fff" }}
            onClick={handlePasswordFormSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Password;
