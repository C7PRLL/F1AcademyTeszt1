import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Pilots from './pages/Pilots'; 
import Register from './pages/Register';
import Login from './pages/Login'; 
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Track from './pages/Track';
import './App.css'; 

function App() {
  return (
    <Router>
      <div id="page-wrapper">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track" element={<Track />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;