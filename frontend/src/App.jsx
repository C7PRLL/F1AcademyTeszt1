import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Pilots from './pages/Pilots';
import Standings from './pages/Standings';
import Register from './pages/Register';
import Login from './pages/Login';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Track from './pages/Track';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pilots" element={<Pilots />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </Router>
  );
}

export default App;