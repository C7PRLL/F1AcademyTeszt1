import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ bio: '', favorite_team: '', favorite_pilot: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Felhasználói adatok betöltése
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          setLoading(false);
          return;
        }

        // Lekérjük a teljes profiladatot a backendről (ID alapján)
        const res = await axios.get(`http://localhost:5000/api/users/${storedUser.id}`);
        
        if (res.data) {
          setUser(res.data);
          setFormData({
            bio: res.data.bio || '',
            favorite_team: res.data.favorite_team || '',
            favorite_pilot: res.data.favorite_pilot || ''
          });
        }
      } catch (error) {
        console.error('Profil lekérési hiba:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 2. Profil frissítése (Adatok + Kép beküldése)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('bio', formData.bio);
    data.append('favorite_team', formData.favorite_team);
    data.append('favorite_pilot', formData.favorite_pilot);
    if (image) data.append('image', image);

    try {
      const res = await axios.put(`http://localhost:5000/api/users/update/${user.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.user);
      alert("Sikeres mentés!");
      window.location.reload(); // Frissítjük a képet is
    } catch (err) {
      alert("Hiba a mentés során.");
    }
  };

  // 3. Kijelentkezés
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) return <div className="wrapper"><div className="container"><p>Betöltés...</p></div></div>;

  if (!user) {
    return (
      <div className="wrapper">
        <div className="container">
          <section className="glass-box" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Profil</h2>
            <p>Nincs bejelentkezve.</p>
            <button className="button primary" onClick={() => window.location.href='/login'}>Ugrás a belépéshez</button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="container">
        <header className="major">
          <h2>Saját Profil</h2>
          <p>Kezeld az adataidat és a megjelenésedet</p>
        </header>

        <div className="glass-box" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3em', justifyContent: 'center' }}>
            
            {/* BAL OLDAL: Kép és Név */}
            <div style={{ textAlign: 'center', minWidth: '250px' }}>
              <div className="profile-pic-wrapper">
                <img 
                  src={user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : "https://via.placeholder.com/200?text=Nincs+kép"} 
                  alt="Profil" 
                />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '0.5em' }}>{user.name}</h3>
              <p style={{ opacity: 0.5 }}>{user.email}</p>
              
              <button className="button small" onClick={handleLogout} style={{ marginTop: '1em', minWidth: '150px' }}>
                Kijelentkezés
              </button>
            </div>

            {/* JOBB OLDAL: Szerkesztés */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <form onSubmit={handleUpdate}>
                <label>Rólam (Bio)</label>
                <textarea 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                  placeholder="Írj magadról pár szót..."
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
                  Változtatások mentése
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;