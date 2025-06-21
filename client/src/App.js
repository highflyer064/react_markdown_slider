import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SlideViewer from './components/SlideViewer';
import EditSlide from './components/EditSlide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SlideViewer />} />
        <Route path="/edit/:id" element={<EditSlide />} />
        <Route path="/new" element={<EditSlide />} />
      </Routes>
    </Router>
  );
}

export default App;