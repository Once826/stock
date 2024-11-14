import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexData from './components/IndexData';
import ForexData from './components/ForexData';
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
