import { useState, useEffect } from 'react';
import axios from 'axios';

function Pilots() {
    const [pilots, setPilots] = useState([]);
    const [newPilot, setNewPilot] = useState({ name: '', nationality: '', is_active: true });
    
    // Felhasználó ellenőrzése
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchPilots = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pilots');
            setPilots(res.data);
        } catch (err) {
            console.error("Hiba a betöltéskor:", err);
        }
    };

    useEffect(() => { fetchPilots(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/pilots', newPilot);
            setNewPilot({ name: '', nationality: '', is_active: true });
            fetchPilots();
            alert("Pilóta mentve!");
        } catch (err) {
            alert("Hiba történt a mentéskor.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törlöd?")) {
            try {
                await axios.delete(`http://localhost:5000/api/pilots/${id}`);
                fetchPilots();
            } catch (err) {
                alert("Hiba a törléskor.");
            }
        }
    };

    return (
        <div id="main" className="wrapper">
            <div className="container">
                <header className="major">
                    <h2>Pilóták nyilvántartása</h2>
                    <p>{user ? "Adatbázis karbantartás" : "Böngéssz a pilóták között"}</p>
                </header>

                {/* Új pilóta (Csak belépve) */}
                {user && (
                    <section className="glass-box">
                        <h3>Új pilóta felvétele</h3>
                        <form onSubmit={handleAdd}>
                            <div className="row gtr-uniform">
                                <div className="col-6 col-12-xsmall">
                                    <label>Név</label>
                                    <input 
                                        type="text" 
                                        value={newPilot.name}
                                        onChange={(e) => setNewPilot({...newPilot, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-6 col-12-xsmall">
                                    <label>Nemzetiség</label>
                                    <input 
                                        type="text" 
                                        value={newPilot.nationality}
                                        onChange={(e) => setNewPilot({...newPilot, nationality: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="button primary">
                                        Mentés
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                )}

                {/* Táblázat */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Nemzetiség</th>
                                {user && <th>Művelet</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {pilots.length > 0 ? (
                                pilots.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.nationality}</td>
                                        {user && (
                                            <td>
                                                <button onClick={() => handleDelete(p.id)} className="button small">
                                                    Törlés
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user ? 3 : 2} style={{ textAlign: 'center' }}>Nincs adat</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Pilots;