import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', formData);
            
            // Felhasználó mentése a böngészőbe
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert("Üdvözlünk, " + res.data.user.name + "!");
            navigate('/'); 
            window.location.reload(); 
        } catch (err) {
            setError(err.response?.data?.error || "Hiba történt!");
        }
    };

    return (
        <div id="main" className="wrapper">
            <div className="container">
                <header className="major">
                    <h2>Bejelentkezés</h2>
                    <p>Lépj be a fiókodba a kezelőfelület eléréséhez.</p>
                </header>

                {/* Letisztult üveg-doboz, fix szélességgel középen */}
                <section className="glass-box" style={{ maxWidth: '500px', margin: '0 auto', padding: '2em' }}>
                    <form onSubmit={handleSubmit}>
                        <label>E-mail cím</label>
                        <input 
                            type="email" 
                            placeholder="pelda@email.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                        />

                        <label>Jelszó</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />

                        {/* A gomb az App.css miatt már magától középen lesz és sleek */}
                        <button type="submit" className="button primary">
                            Bejelentkezés
                        </button>
                    </form>
                    
                    {error && (
                        <p style={{ color: '#e44c65', textAlign: 'center', marginTop: '1em', fontWeight: 'bold' }}>
                            {error}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Login;