
export default function Footer() {
  return (
    <footer
      className="text-center text-white footer"
    >
      <div className=" pt-4">
        <section className="mb-1">
          <a
            target="_blank"
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="https://www.facebook.com/profile.php?id=61573779539848"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <i className="bi bi-facebook social-links"></i>
          </a>

          <a
            target="_blank"
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="https://x.com/RACipeHub"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <i className="bi bi-twitter-x social-links"></i>
          </a>

          <a
            target="_blank"
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="https://www.instagram.com/racipehub/"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <i className="bi bi-instagram social-links"></i>
          </a>

          <a
            target="_blank"
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="https://www.pinterest.com/racipehub/"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <i className="bi bi-pinterest social-links"></i>
          </a>
        </section>
      </div>

      <div
        className="text-center text-dark p-3"
      >
        <p className="small">© 2025 Copyright RACipe Hub</p>
      </div>
    </footer>
  );
}
