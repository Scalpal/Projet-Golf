import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect  } from 'react';
import { LoginContext } from './components/Helper/LoginContext';

import Navbar from './components/main/Navbar.jsx';
import Home from './components/main/Home.js';
import Dashboard from './components/main/Dashboard';
import TournamentRanking from './components/main/TournamentRanking';
import PlayerRanking from './components/main/PlayerRanking';
import Players from './components/main/Players';
import Tournaments from './components/main/Tournaments';
import Login from './components/main/Login';
import AddAdmin from './components/main/AddAdmin';
 


function App() {

  const [ isLoggedIn , setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <div id="root" >
        <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
          <Navbar />

          <Routes>        
            <Route exact path="/" element={<Home />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="playerRanking" element={<PlayerRanking />} />
            <Route exact path="/tournamentRanking" element={<TournamentRanking />} />
            <Route exact path="/playerStats" element={<Players />} />
            <Route exact path="/tournaments" element={<Tournaments />} />

            {/* <Route exact path="/admin/players/list" element={} /> */}
            <Route exact path='/admin/addAdmin' element={<AddAdmin />} />
            <Route exact path="/admin/login" element={<Login />} />

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
