import { Link } from 'react-router-dom';

function Header() {
  return (
    <header id="header">
      <h1 id="logo"><Link style={{border: "none"}} to="/">F1 ACADÉMIA</Link></h1>
      <nav id="nav">
        <ul>
          <li><Link to="/">Főoldal</Link></li>
          <li><Link to="/pilots">Pilóták</Link></li>
          <li><Link to="/diagrams">Diagramok</Link></li>
          <li><Link to="/register" className="button primary">Regisztráció</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;