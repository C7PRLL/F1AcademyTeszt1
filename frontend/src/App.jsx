import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pilots, setPilots] = useState([]); // Itt tároljuk a pilótákat
  const [loading, setLoading] = useState(true);

  // Ez a kód lefut, amikor betölt az oldal
  useEffect(() => {
    // Meghívjuk a backendünket (Port 5000)
    axios.get('http://localhost:5000/api/pilots')
      .then(response => {
        setPilots(response.data); // Elmentjük a kapott adatokat
        setLoading(false);
      })
      .catch(error => {
        console.error("Hiba az adatok lekérésekor:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>🏎️ F1 Academy - Pilóták</h1>
      
      {loading ? (
        <p>Betöltés...</p>
      ) : (
        <div className="card-container">
          {pilots.length > 0 ? (
            <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th>Név</th>
                  <th>Nemzetiség</th>
                  <th>Státusz</th>
                </tr>
              </thead>
              <tbody>
                {pilots.map(pilot => (
                  <tr key={pilot.id}>
                    <td>{pilot.name}</td>
                    <td>{pilot.nationality}</td>
                    <td>{pilot.is_active ? '✅ Aktív' : '❌ Visszavonult'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nincs pilóta az adatbázisban. (Vegyél fel egyet a HeidiSQL-ben!)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;