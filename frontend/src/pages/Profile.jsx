import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ bio: '', favorite_team: '', favorite_pilot: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${localUser.id}`)
            .then(res => {
                setUser(res.data);
                setFormData({ 
                    bio: res.data.bio || '', 
                    favorite_team: res.data.favorite_team || '', 
                    favorite_pilot: res.data.favorite_pilot || '' 
                });
            });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('bio', formData.bio);
        data.append('favorite_team', formData.favorite_team);
        data.append('favorite_pilot', formData.favorite_pilot);
        if (image) data.append('image', image);

        try {
            const res = await axios.put(`http://localhost:5000/api/users/update/${localUser.id}`, data);
            setUser(res.data.user);
            alert("Sikeres mentés!");
        } catch (err) {
            alert("Hiba a mentés során.");
        }
    };

    if (!user) return <p>Betöltés...</p>;

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Saját Profil</h2>
                    <p>Módosítsd az adataidat és a megjelenésedet.</p>
                </header>

                <div className="row gtr-150">
                    <div className="col-4 col-12-medium align-center">
                        {/* Profilkép megjelenítése */}
                        <span className="image fit" style={{ borderRadius: '50%', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto' }}>
                            <img src={user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : "https://via.placeholder.com/200?text=Nincs+kép"} alt="Profile" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        </span>
                        <h3>{user.name}</h3>
                    </div>

                    <div className="col-8 col-12-medium">
                        <form onSubmit={handleUpdate}>
                            <div className="row gtr-uniform">
                                <div className="col-12">
                                    <label>Rólam (Bio):</label>
                                    <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="3"></textarea>
                                </div>
                                <div className="col-6 col-12-xsmall">
                                    <label>Kedvenc Csapat:</label>
                                    <input type="text" value={formData.favorite_team} onChange={(e) => setFormData({...formData, favorite_team: e.target.value})} />
                                </div>
                                <div className="col-6 col-12-xsmall">
                                    <label>Kedvenc Versenyző:</label>
                                    <input type="text" value={formData.favorite_pilot} onChange={(e) => setFormData({...formData, favorite_pilot: e.target.value})} />
                                </div>
                                <div className="col-12">
                                    <label>Profilkép feltöltése:</label>
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="col-12">
                                    <ul className="actions">
                                        <li><input type="submit" value="Profil mentése" className="primary" /></li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;