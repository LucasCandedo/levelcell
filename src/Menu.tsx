import "./Menu.css";

export default function Menu() {
  return (
    <div className="menu">
      <div className="menu-logo">
        <img src="../src/assets/logo.png" alt="" />
      </div>
      <nav className="menu-navbar">
        <ul className="menu-list">
          <a href="#" className="menu-link">
            Home
          </a>
          <a href="#" className="menu-link">
            Imei Generator
          </a>
        </ul>
      </nav>
    </div>
  );
}
