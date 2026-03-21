import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Ezzel tudjuk átirányítani a júzert a login után

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', formData);
            
            // Elmentjük a felhasználó adatait a böngésző memóriájába (localStorage)
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert("Üdvözlünk, " + res.data.user.name + "!");
            navigate('/'); // Visszavisz a főoldalra
            window.location.reload(); // Frissítjük a menüt
        } catch (err) {
            setError(err.response?.data?.error || "Hiba történt!");
        }
    };

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Bejelentkezés</h2>
                    <p>Lépj be a fiókodba a kezelőfelület eléréséhez.</p>
                </header>

                <section className="container xsmall">
                    <form onSubmit={handleSubmit}>
                        <div className="row gtr-uniform">
                            <div className="col-12">
                                <input type="email" placeholder="E-mail cím" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div className="col-12">
                                <input type="password" placeholder="Jelszó" 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                            </div>
                            <div className="col-12">
                                <ul className="actions special">
                                    <li><input type="submit" value="Belépés" className="primary" /></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                    {error && <p style={{color: '#e44c65', textAlign: 'center', marginTop: '1em'}}>{error}</p>}
                </section>
            </div>
        </div>
    );
}

export default Login;