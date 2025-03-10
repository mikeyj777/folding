import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import AminoAcidViewer from './components/AminoAcidViewer';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aa-view" element={<AminoAcidViewer/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;