import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Pilots from './pages/Pilots'; 
import Register from './pages/Register';
import Login from './pages/Login'; 
import Booking from './pages/Booking';
import Profile from './pages/Profile';
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
          
          {/* 2. LÉPÉS: VEDD FEL AZ ÚTVONALAT */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Később ide jöhet majd a: <Route path="/diagrams" element={<Diagrams />} /> */}
        </Routes>
        
        {/* Itt lehet egy Footer komponens is */}
      </div>
    </Router>
  );
}

export default App;