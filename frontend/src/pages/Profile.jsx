import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Profile() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });

        if (res.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (error) {
        console.error('Profil lekérési hiba:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      window.location.href = 'http://localhost:5000/api/auth/logout';
    } catch (error) {
      console.error('Logout hiba:', error);
    }
  };

  if (!user) {
    return (
      <div className="wrapper">
        <div className="container">
          <section
            className="glass-box"
            style={{ maxWidth: '500px', margin: '0 auto', padding: '2em', textAlign: 'center' }}
          >
            <h2>Profil</h2>
            <p>Nincs bejelentkezve.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="container">
        <section
          className="glass-box"
          style={{ maxWidth: '600px', margin: '0 auto', padding: '2em' }}
        >
          <h2>Profil</h2>
          <p><strong>Név:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button className="button primary" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </section>
      </div>
    </div>
  );
}

export default Profile;