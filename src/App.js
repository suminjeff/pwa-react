import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Text from './pages/Text';
import Speech from './pages/Speech';

function App() {
  return (
    <div className='w-100'>
     <Routes>
       <Route path="/text" element={<Text />} />
       <Route path="/speech" element={<Speech />} />
     </Routes>
     <Navbar />
    </div>
  );
}

export default App;
