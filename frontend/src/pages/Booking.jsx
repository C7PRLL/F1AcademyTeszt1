import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Booking() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState([]);

    // Űrlap állapotok
    const [activityType, setActivityType] = useState('Bérgokart');
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');

    // Idősáv definíciók
    const slots = {
        'Bérgokart': ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00', 'Egész nap'],
        'Versenygokart': ['08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30'],
        'Verseny csomag': ['09:00 - 11:00', '13:00 - 15:00', '16:00 - 18:00']
    };

    // Ha változik az activityType, állítsuk az első elérhető idősávra alapból
    useEffect(() => {
        setTimeSlot(slots[activityType][0]);
    }, [activityType]);

    useEffect(() => {
        if (!user) navigate('/login');
        else fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const res = await axios.get(`http://localhost:5000/api/bookings/my-bookings/${user.id}`);
        setMyBookings(res.data);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/bookings', {
                user_id: user.id,
                activity_type: activityType,
                booking_date: bookingDate,
                time_slot: timeSlot
            });
            alert("Sikeres foglalás!");
            fetchBookings();
        } catch (err) {
            alert("Hiba történt.");
        }
    };

    if (!user) return null;

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Versenypálya Foglalás</h2>
                    <p>Válassz eszközt és időpontot a teszteléshez.</p>
                </header>

                <section className="container small" style={{background: 'rgba(255,255,255,0.05)', padding: '2em', borderRadius: '10px'}}>
                    <form onSubmit={handleBooking}>
                        <div className="row gtr-uniform">
                            {/* 1. VÁLASZTÁS: Típus */}
                            <div className="col-12">
                                <label>Mivel szeretnél menni?</label>
                                <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                                    <option value="Bérgokart">🏎️ Bérgokart (Standard)</option>
                                    <option value="Versenygokart">🏁 Versenygokart (Pro - 30 perc)</option>
                                    <option value="Verseny csomag">🏆 Verseny csomag (2 óra)</option>
                                </select>
                            </div>

                            {/* 2. VÁLASZTÁS: Dátum */}
                            <div className="col-6 col-12-xsmall">
                                <label>Dátum:</label>
                                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                            </div>

                            {/* 3. VÁLASZTÁS: Dinamikus Idősáv */}
                            <div className="col-6 col-12-xsmall">
                                <label>Szabad időpontok:</label>
                                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                                    {slots[activityType].map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12">
                                <ul className="actions special">
                                    <li><input type="submit" value="Foglalás mentése" className="primary" /></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </section>

                <hr className="major" />

                <h3>Foglalási előzményeid</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Típus</th>
                                <th>Dátum</th>
                                <th>Idősáv</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{color: '#e44c65', fontWeight: 'bold'}}>{b.activity_type}</td>
                                    <td>{b.booking_date}</td>
                                    <td>{b.time_slot}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Booking;