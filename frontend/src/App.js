import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreateSK from './components/SK/CreateSK'; // Import CreateSK
import SKList from './components/SK/SKList'; // Import SKList
import SKDetail from './components/SK/SKDetail'; // Import SKDetail
import './App.css'; // Assuming you have some basic CSS

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-sk" element={<CreateSK />} /> {/* Add route for CreateSK */}
          <Route path="/sks" element={<SKList />} /> {/* Add route for SKList */}
          <Route path="/sk/:id" element={<SKDetail />} /> {/* Add route for SKDetail */}
          {/* Add other routes here later */}
          <Route path="/" element={<h1>Welcome to SK Automation</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
