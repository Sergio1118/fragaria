import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AgregarTrabajador = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmation: false,
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (editIndex !== null) {
      if (!formData.password) newErrors.password = "La contraseña es obligatoria";
      if (formData.password !== formData.confirmation) {
        newErrors.confirmation = "Las contraseñas no coinciden";
      }
    } else {
      if (!formData.name) newErrors.name = "El nombre es obligatorio";
      if (!formData.surname) newErrors.surname = "El apellido es obligatorio";
      if (!formData.password) newErrors.password = "La contraseña es obligatoria";
      if (formData.password !== formData.confirmation) {
        newErrors.confirmation = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newTrabajadores = [...trabajadores];

      if (editIndex !== null) {
        newTrabajadores[editIndex].email = formData.email;
      } else {
        newTrabajadores.push({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
        });
      }

      setTrabajadores(newTrabajadores);
      setIsFormVisible(false);
      setFormData({ name: "", surname: "", email: "", password: "", confirmation: "" });
      setEditIndex(null);
    }
  };

  const handleEdit = (index) => {
    setFormData({
      name: trabajadores[index].name,
      surname: trabajadores[index].surname,
      email: trabajadores[index].email,
      password: "",
      confirmation: "",
    });
    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este trabajador?")) {
      setTrabajadores(trabajadores.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-center mb-4">
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditIndex(null);
            setFormData({ name: "", surname: "", email: "", password: "", confirmation: "" });
          }}
          className="btn btn-gradient shadow-lg text-white py-3 px-5"
          style={{
            borderRadius: "50px",
            fontSize: "1.2rem",
            background: "linear-gradient(90deg, #f47c7c, #5c47f4)",
            border: "none",
          }}
        >
          {isFormVisible ? "Cancelar" : "Agregar trabajador"}
        </button>
      </div>

      {isFormVisible && (
        <div className="card shadow-lg p-4 rounded-lg">
          <h3 className="mb-4 text-center text-gradient">
            {editIndex !== null ? "Editar Trabajador" : "Registrar Trabajador"}
          </h3>
          <form onSubmit={handleSubmit}>
            {["name", "surname"].map((field) => (
              <div key={field} className="mb-4">
                <input
                  type="text"
                  className="form-control border-0 rounded-pill p-3"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  disabled={editIndex !== null} // Bloqueado al editar
                />
              </div>
            ))}

            <div className="mb-4">
              <input
                type="email"
                className={`form-control border-0 rounded-pill p-3 ${errors.email ? "is-invalid" : ""}`}
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {["password", "confirmation"].map((field) => (
              <div key={field} className="mb-4 position-relative">
                <input
                  type="password"
                  className={`form-control border-0 rounded-pill p-3 ${errors[field] ? "is-invalid" : ""}`}
                  placeholder={field === "confirmation" ? "Confirmar contraseña" : "Contraseña"}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}

            <button type="submit" className="btn btn-gradient w-100 mt-3 py-3">
              {editIndex !== null ? "Actualizar" : "Registrar"}
            </button>
          </form>
        </div>
      )}

      <div className="mt-5">
        <h3 className="mb-4 text-center text-gradient">Trabajadores Registrados</h3>
        {trabajadores.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3">
            {trabajadores.map((trabajador, index) => (
              <div key={index} className="col mb-4">
                <div className="card shadow-lg h-100 rounded-lg">
                  <div className="card-body">
                    <h5 className="card-title text-center text-primary">
                      {trabajador.name} {trabajador.surname}
                    </h5>
                    <p className="card-text text-muted text-center">{trabajador.email}</p>
                    <div className="d-flex justify-content-between">
                      <button onClick={() => handleEdit(index)} className="btn btn-warning">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(index)} className="btn btn-danger">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No hay trabajadores registrados.</p>
        )}
      </div>
    </div>
  );
};

export default AgregarTrabajador;



