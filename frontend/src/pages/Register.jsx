import { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/register', formData);
            setMessage(res.data.message);
            setFormData({ name: '', email: '', password: '' }); 
            alert("Sikeres regisztráció! Most már bejelentkezhetsz.");
        } catch (err) {
            setMessage("Hiba történt: " + (err.response?.data?.error || "Ismeretlen hiba"));
        }
    };

    return (
        <div id="main" className="wrapper">
            <div className="container">
                <header className="major">
                    <h2>Regisztráció</h2>
                    <p>Csatlakozz az F1 Akadémia közösségéhez!</p>
                </header>
                <section className="glass-box" style={{ maxWidth: '600px', margin: '0 auto', padding: '2em' }}>
                    <form onSubmit={handleSubmit}>
                        <label>Teljes név</label>
                        <input 
                            type="text" 
                            placeholder="pl. Kis Pista" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                        />

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
                        <button type="submit" className="button primary">
                            Fiók létrehozása
                        </button>
                    </form>

                    {message && (
                        <p style={{ textAlign: 'center', color: '#e44c65', marginTop: '1em', fontWeight: 'bold' }}>
                            {message}
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Register;