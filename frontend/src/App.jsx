import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Pilots from './pages/Pilots'; 
import Register from './pages/Register'; // 1. EZT ADD HOZZÁ AZ IMPORTOKHOZ!
import './App.css'; 

function App() {
  return (
    <Router>
      <div id="page-wrapper">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          {/* 2. IDE KERÜL AZ ÚJ ROUTE: */}
          <Route path="/register" element={<Register />} /> 
          
          {/* Később ide jöhet majd a: <Route path="/diagrams" element={<Diagrams />} /> */}
        </Routes>
        
        {/* Itt lehet egy Footer komponens is */}
      </div>
    </Router>
  );
}

export default App;