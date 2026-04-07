import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Loader from './components/Loader';

import Home from './pages/Home';
import Pilots from './pages/Pilots';
import Standings from './pages/Standings';
import News from './pages/News';
import Register from './pages/Register';
import Login from './pages/Login';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Track from './pages/Track';
import AuthSuccess from './pages/AuthSuccess';

import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loader />}

      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/news" element={<News />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track" element={<Track />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;