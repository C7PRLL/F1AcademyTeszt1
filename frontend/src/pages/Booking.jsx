import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// FullCalendar importok
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Booking() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    
    // Űrlap állapotok
    const [activityType, setActivityType] = useState('Bérgokart');
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('10:00 - 12:00');

    const slots = {
        'Bérgokart': ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'],
        'Versenygokart': ['08:00 - 08:30', '09:00 - 09:30', '10:00 - 10:30'],
        'Verseny csomag': ['09:00 - 11:00', '14:00 - 16:00']
    };

    useEffect(() => {
        if (!user) navigate('/login');
        else fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const res = await axios.get(`http://localhost:5000/api/bookings/my-bookings/${user.id}`);
        
        // Adatok átalakítása FullCalendar formátumra
        const formattedEvents = res.data.map(b => {
            const times = b.time_slot.split(' - ');
            return {
                id: b.id,
                title: b.activity_type,
                start: `${b.booking_date}T${times[0]}:00`,
                end: `${b.booking_date}T${times[1]}:00`,
                backgroundColor: b.activity_type === 'Verseny csomag' ? '#e44c65' : '#39c088',
                borderColor: 'transparent'
            };
        });
        setEvents(formattedEvents);
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
        } catch (err) { alert("Hiba történt."); }
    };

    if (!user) return null;

    return (
        <div id="main" className="wrapper style1">
            <div className="container">
                <header className="major">
                    <h2>Pályafoglalási Naptár</h2>
                    <p>Válassz időpontot és kövesd nyomon a naptárban.</p>
                </header>

                {/* ŰRLAP RÉSZ */}
                <section className="glass-box" style={{marginBottom: '3em', padding: '20px'}}>
                    <form onSubmit={handleBooking} className="row gtr-uniform">
                        <div className="col-4 col-12-xsmall">
                            <label>Típus</label>
                            <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                                <option value="Bérgokart">Bérgokart</option>
                                <option value="Versenygokart">Versenygokart</option>
                                <option value="Verseny csomag">Verseny csomag</option>
                            </select>
                        </div>
                        <div className="col-3 col-12-xsmall">
                            <label>Dátum</label>
                            <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                        </div>
                        <div className="col-3 col-12-xsmall">
                            <label>Idősáv</label>
                            <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                                {slots[activityType].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-2 col-12-xsmall" style={{display: 'flex', alignItems: 'flex-end'}}>
                            <input type="submit" value="Foglalás" className="primary fit" />
                        </div>
                    </form>
                </section>

                {/* NAPTÁR */}
                <div className="calendar-container" style={{ background: '#ffffff', padding: '20px', borderRadius: '13px', color: '#333' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        locale="hu"
                        slotMinTime="08:00:00"
                        slotMaxTime="18:00:00"
                        allDaySlot={false}
                        height="auto"
                    />
                </div>
            </div>
        </div>
    );
}

export default Booking;