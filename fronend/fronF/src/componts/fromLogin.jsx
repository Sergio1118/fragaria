import { useState } from 'react'; // Asegúrate de importar useState de React
import { Link } from "react-router-dom";
const FromLogin = () => {
  const [email, setEmail] = useState(''); // Inicializamos el estado para el correo
  const [password, setPassword] = useState(''); // Inicializamos el estado para la contraseña

  const handleLogin = (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    console.log('Iniciando sesión con:', { email, password });
    // Aquí puedes agregar la lógica para autenticar al usuario con el backend
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualizamos el estado del correo
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualizamos el estado de la contraseña
            required
          />
        </div><br />

        <div className="text-center mt-3">
          {/* El enlace a la página de recuperación de contraseña */}
          <Link to="/passwordRecovery">Recuperar contraseña</Link>
        </div>

        {/* Salto de línea para separar visualmente el contenido */}
        <br />

        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      
      </form>
    </div>
  );
};

export default FromLogin;
