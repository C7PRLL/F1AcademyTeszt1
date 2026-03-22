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
        } catch (err) {
            setMessage("Hiba történt: " + err.response.data.error);
        }
    };

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Regisztráció</h2>
                    <p>Csatlakozz az F1 Akadémia közösségéhez!</p>
                </header>

                <section className="container medium">
                    <form onSubmit={handleSubmit}>
                        <div className="row gtr-uniform">
                            <div className="col-12">
                                <input type="text" placeholder="Név" value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="col-12">
                                <input type="email" placeholder="E-mail cím" value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div className="col-12">
                                <input type="password" placeholder="Jelszó" value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                            </div>
                            <div className="col-12">
                                <ul className="actions special">
                                    <li><input type="submit" value="Regisztráció" className="primary" /></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                    {message && <p style={{textAlign: 'center', color: '#e44c65'}}>{message}</p>}
                </section>
            </div>
        </div>
    );
}

export default Register;