import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect  } from 'react';
import { LoginContext } from './components/Helper/LoginContext';
import Axios from 'axios';

import Navbar from './components/main/Navbar.jsx';
import Home from './components/main/Home.js';
import Dashboard from './components/main/Dashboard';
import TournamentRanking from './components/main/TournamentRanking';
import PlayerRanking from './components/main/PlayerRanking';
import Players from './components/main/Players';
import Tournaments from './components/main/Tournaments';
import Login from './components/main/admin/Login';
import AdminRegister from './components/main/admin/AdminRegister';
import AdminAddScores from './components/main/admin/AdminAddScores';
import AdminAddTournaments from './components/main/admin/AdminAddTournaments';
import AdminPlayerList from './components/main/admin/AdminPlayerList';
 import AdminPlayerAdd from './components/main/admin/AdminPlayerAdd';
import AdminPlayerEdit from './components/main/admin/AdminPlayerEdit';
import ProtectedRoute from './components/main/ProtectedRoute';

function App() {

  const [ isLoggedIn , setIsLoggedIn] = useState(null);

  // useEffect(async() => {
  //   const response = await Axios.get('http://localhost:3001/admin/login');

  //   setIsLoggedIn(response.data.loggedIn);
    
  // }, [])
  // console.log("app.js isLoggedIn", isLoggedIn);


  return (
    <BrowserRouter>
      <div id="root">
          <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            <Navbar />
            
            <Routes>        
              <Route exact path="/" element={<Home />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="playerRanking" element={<PlayerRanking />} />
              <Route exact path="/tournamentRanking/:gender" element={<TournamentRanking />} />
              <Route exact path="/playerStats" element={<Players />} />
              <Route exact path="/tournaments" element={<Tournaments />} />

              <Route exact path="/admin/player/list" element={<ProtectedRoute> <AdminPlayerList/> </ProtectedRoute>} />
              <Route exact path="/admin/player/add" element={<ProtectedRoute> <AdminPlayerAdd /> </ProtectedRoute>} />
              <Route exact path="/admin/player/:idJoueur/edit" element={<ProtectedRoute> <AdminPlayerEdit /> </ProtectedRoute>} />
              <Route exact path="/admin/tournament/create" element={<ProtectedRoute> <AdminAddTournaments /> </ProtectedRoute>} />
              <Route exact path="/admin/tournament/addScores" element={<ProtectedRoute> <AdminAddScores /> </ProtectedRoute>} />
              <Route exact path='/admin/register' element={<ProtectedRoute> <AdminRegister /> </ProtectedRoute>} />
              <Route exact path="/admin/login" element={<Login />} />

              <Route path="*" element={<Dashboard />} />
            </Routes>
          </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
