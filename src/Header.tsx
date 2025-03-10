import "./Header.css";

function App() {
  return (
    <header>
      <span className="levelcell_logo">levelcell</span>
      <nav className="navbar">
        <ul className="list">
          <li className="item">
            <a href="#" className="navbar-btn">
              Home
            </a>
          </li>
          <li className="item">
            <a href="#" className="navbar-btn">
              Tools
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default App;
