import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/login',
        formData,
        { withCredentials: true }
      );

      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert('Üdvözlünk, ' + res.data.user.name + '!');
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Hiba történt!');
    }
  };

  return (
    <div id="main" className="wrapper">
      <div className="container">
        <header className="major">
          <h2>Bejelentkezés</h2>
          <p>Lépj be a fiókodba a kezelőfelület eléréséhez.</p>
        </header>

        <section
          className="glass-box"
          style={{ maxWidth: '500px', margin: '0 auto', padding: '2em' }}
        >
          <form onSubmit={handleSubmit}>
            <label>E-mail cím</label>
            <input
              type="email"
              placeholder="pelda@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <label>Jelszó</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <button type="submit" className="button primary">
              Bejelentkezés
            </button>
          </form>

          {error && (
            <p
              style={{
                color: '#e44c65',
                textAlign: 'center',
                marginTop: '1em',
                fontWeight: 'bold',
              }}
            >
              {error}
            </p>
          )}

          <hr style={{ margin: '2em 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="button"
              onClick={() => {
                window.location.href = 'http://localhost:5000/api/auth/google';
              }}
            >
              Bejelentkezés Google-lel
            </button>

            <button
              type="button"
              className="button"
              onClick={() => {
                window.location.href = 'http://localhost:5000/api/auth/facebook';
              }}
            >
              Bejelentkezés Facebookkal
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;