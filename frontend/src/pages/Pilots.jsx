import { useState, useEffect } from 'react';
import axios from 'axios';

function Pilots() {
    const [pilots, setPilots] = useState([]);
    const [newPilot, setNewPilot] = useState({ name: '', nationality: '', is_active: true });

    // Pilóták betöltése
    const fetchPilots = async () => {
        const res = await axios.get('http://localhost:5000/api/pilots');
        setPilots(res.data);
    };

    useEffect(() => { fetchPilots(); }, []);

    // Új pilóta beküldése
    const handleAdd = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/pilots', newPilot);
        setNewPilot({ name: '', nationality: '', is_active: true });
        fetchPilots(); // Lista frissítése
    };

    // Törlés
    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni akarod?")) {
            await axios.delete(`http://localhost:5000/api/pilots/${id}`);
            fetchPilots(); // Lista frissítése
        }
    };

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Pilóták kezelése</h2>
                    <p>Adatok hozzáadása és törlése az adatbázisból.</p>
                </header>

                {/* ÚJ PILÓTA ŰRLAP */}
                <section style={{marginBottom: '3em'}}>
                    <form onSubmit={handleAdd}>
                        <div className="row gtr-uniform">
                            <div className="col-4 col-12-xsmall">
                                <input type="text" placeholder="Név" value={newPilot.name}
                                    onChange={(e) => setNewPilot({...newPilot, name: e.target.value})} required />
                            </div>
                            <div className="col-4 col-12-xsmall">
                                <input type="text" placeholder="Nemzetiség" value={newPilot.nationality}
                                    onChange={(e) => setNewPilot({...newPilot, nationality: e.target.value})} required />
                            </div>
                            <div className="col-4 col-12-xsmall">
                                <ul className="actions">
                                    <li><input type="submit" value="Hozzáadás" className="primary" /></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </section>

                {/* TÁBLÁZAT */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Név</th>
                                <th>Nemzetiség</th>
                                <th>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pilots.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.nationality}</td>
                                    <td>
                                        <button onClick={() => handleDelete(p.id)} className="button small">Törlés</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Pilots;