import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Pilots from './pages/Pilots'; // Ezt majd létre kell hoznod!
import './App.css'; // A nagy CSS-ed legyen itt

function App() {
  return (
    <Router>
      <div id="page-wrapper">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          {/* További oldalak ide jönnek: /register, /diagrams */}
        </Routes>
        
        {/* Itt lehet egy Footer komponens is */}
      </div>
    </Router>
  );
}

export default App;