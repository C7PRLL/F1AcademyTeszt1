import { Link } from 'react-router-dom';

function Header() {
  // Megnézzük, hogy van-e elmentett felhasználó a böngésző memóriájában (localStorage)
  const user = JSON.parse(localStorage.getItem('user'));

  // Kijelentkezés funkció: töröljük a memóriát és frissítjük az oldalt
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload(); // Frissítjük az oldalt, hogy a menü visszaálljon
  };

  return (
    <header id="header">
      <h1 id="logo">
        <Link style={{ border: "none" }} to="/">F1 ACADÉMIA</Link>
      </h1>
      <nav id="nav">
        <ul>
          <li><Link to="/">Főoldal</Link></li>
          <li><Link to="/pilots">Pilóták</Link></li>
          <li><Link to="/diagrams">Diagramok</Link></li>

          {/* Kondicionális renderelés: Ha be van lépve a júzer */}
          {user ? (
            <>
              <li style={{ color: '#e44c65', fontWeight: '300' }}>Szia, {user.name}!</li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="button small"
                  style={{ marginLeft: '10px' }}
                >
                  Kijelentkezés
                </button>
              </li>
            </>
          ) : (
            /* Ha nincs belépve senki */
            <>
              <li><Link to="/register">Regisztráció</Link></li>
              <li><Link to="/login" className="button primary">Bejelentkezés</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;