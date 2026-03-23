import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ bio: '', favorite_team: '', favorite_pilot: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (localUser) {
            axios.get(`http://localhost:5000/api/users/${localUser.id}`)
                .then(res => {
                    setUser(res.data);
                    setFormData({ 
                        bio: res.data.bio || '', 
                        favorite_team: res.data.favorite_team || '', 
                        favorite_pilot: res.data.favorite_pilot || '' 
                    });
                })
                .catch(err => console.error(err));
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('bio', formData.bio);
        data.append('favorite_team', formData.favorite_team);
        data.append('favorite_pilot', formData.favorite_pilot);
        if (image) data.append('image', image);

        try {
            await axios.put(`http://localhost:5000/api/users/update/${localUser.id}`, data);
            alert("Profil frissítve!");
            window.location.reload(); 
        } catch (err) {
            alert("Hiba a mentés során.");
        }
    };

    if (!user) return <div id="main" className="wrapper"><div className="container"><p>Betöltés...</p></div></div>;

    return (
        <div id="main" className="wrapper">
            <div className="container">
                <header className="major">
                    <h2>Saját Profil</h2>
                    <p>Adataid és megjelenésed kezelése</p>
                </header>

                {/* Egyszerű Flex elrendezés a kép és az űrlap között */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3em', justifyContent: 'center' }}>
                    
                    {/* BAL OLDAL: Kép és név */}
                    <div style={{ textAlign: 'center', minWidth: '250px' }}>
                        <div className="profile-pic-wrapper">
                            <img 
                                src={user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : "https://via.placeholder.com/200?text=Nincs+kép"} 
                                alt="Profil" 
                            />
                        </div>
                        <h3>{user.name}</h3>
                        <p style={{ opacity: 0.5 }}>{user.email}</p>
                    </div>

                    {/* JOBB OLDAL: Űrlap */}
                    <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px' }}>
                        <form onSubmit={handleUpdate}>
                            <label>Rólam</label>
                            <textarea 
                                value={formData.bio} 
                                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                                rows="3"
                            />

                            <label>Kedvenc Csapat</label>
                            <input 
                                type="text" 
                                value={formData.favorite_team} 
                                onChange={(e) => setFormData({...formData, favorite_team: e.target.value})} 
                            />

                            <label>Kedvenc Versenyző</label>
                            <input 
                                type="text" 
                                value={formData.favorite_pilot} 
                                onChange={(e) => setFormData({...formData, favorite_pilot: e.target.value})} 
                            />

                            <label>Profilkép módosítása</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                            <button type="submit" className="button primary">
                                Mentés
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;