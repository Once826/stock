import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexData from './components/IndexData';
import ForexData from './components/ForexData';
import IndexDetails from './components/IndexDetails';
import ForexDetails from './components/ForexDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <div className="App container">
        <NavBar />
        <Routes>
          <Route path="/indices" element={<IndexData />} />
          <Route path="/forex" element={<ForexData />} />
          <Route path="/indices/:ticker" element={<IndexDetails />} />
          <Route path="/forex/:pair" element={<ForexDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
