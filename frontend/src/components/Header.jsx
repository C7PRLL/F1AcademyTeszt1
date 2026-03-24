import { Link } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header id="header">
      <h1 id="logo">
        <Link style={{ border: "none" }} to="/">F1 AKADÉMIA</Link>
      </h1>
      <nav id="nav">
        <ul>
          <li><Link to="/">Főoldal</Link></li>
          <li><Link to="/pilots">Pilóták</Link></li>
          <li><Link to="/standings">Tabella</Link></li>
          <li><Link to="/diagrams">Statisztikák</Link></li>
          <li><Link to="/track">A Pálya</Link></li>
          {user ? (
            <>
              <li><Link to="/booking">Időpontfoglalás</Link></li>
              <li><Link to="/profile">Profilom</Link></li>
              
              <li style={{ color: '#e44c65', fontWeight: '300', marginLeft: '15px' }}>Szia, {user.name}!</li>
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