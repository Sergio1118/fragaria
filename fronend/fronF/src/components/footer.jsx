import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./footer.css"; // Importa el archivo CSS

function Footer() {
  return (
    <div className="d-flex flex-column">
      {/* Footer */}
      <footer className="text-center">
        <p className="footer-brand">
          &copy; 2025 Fragaria. Todos los derechos reservados.
        </p>
        <div className="social-icons my-3">
          <p className="footer-brand">Síguenos en:</p>
          <a
            href="https://www.instagram.com/FragariaApp"
            rel="noopener noreferrer"
            className="mx-2"
          >
            Instagram
          </a>{" "}
          |
          <a
            href="https://www.twitter.com/FragariaApp"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            Twitter
          </a>{" "}
          |
          <a
            href="https://www.facebook.com/FragariaApp"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            Facebook
          </a>
        </div>
        <p className="footer-brand">
          Contáctanos:{" "}
          <a href="mailto:soporte@fragaria.com" >
            soporte@fragaria.com
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Footer;
