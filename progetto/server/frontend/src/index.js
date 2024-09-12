import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Register from './content/Register';
import Login from './content/Login';
import Homepage from './content/Homepage';
import Mappa from './content/Mappa';
import Organizer from './content/Organizer';
import CreateEvent from './content/CreateEvent';
import EventDetails from './content/EventDetails';
import Profile from './content/Profile';
import Category from './content/Category';
import Dashboard from './content/Dashboard';
import ProfileVisited from './content/ProfileVisited';
import { LoadScript } from '@react-google-maps/api';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <LoadScript
    googleMapsApiKey={process.env.REACT_APP_KEY}
    mapIds={[process.env.REACT_APP_MAP_ID]}
  >
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/mappa" element={<Mappa />} />
        <Route path="/organizzatore" element={<Organizer />} />
        <Route path="/organizzatore/crea" element={<CreateEvent />} />
        <Route path="/evento" element={<EventDetails />} />
        <Route path="/profilo" element={<Profile />} />
        <Route path="/user" element={<ProfileVisited />} />
        <Route path="/categorie" element={<Category />} />
      </Routes>
    </Router>
  </LoadScript>

);
