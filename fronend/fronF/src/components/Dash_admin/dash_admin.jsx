import Footer from "../Footer/footer";

function DashboardAdmin() {
    return (
    <div classNames="container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Fragaria</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" aria-current="page" href="#">Perfil</a>
              <a className="nav-link" href="#">Cronograma</a>
              <a className="nav-link" href="#">Trabajadores</a>
              <a className="nav-link" href="#">Informes</a>
              <a className="nav-link" href="#">Actividades</a>
              <a className="nav-link" href="#">Plantación</a>
            </div>
          </div>
        </div>
      </nav>
      <Footer />
    </div>
      
      

      
    );
  }
  
  export default DashboardAdmin;
  