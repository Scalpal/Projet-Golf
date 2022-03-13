import { useState, useEffect } from 'react';
import Axios from 'axios'

function Dashboard () {


    const [tournamentRanking, setTournamentRanking] = useState([])
    const [playerRanking, setPlayerRanking] = useState([])



    useEffect (async () => {
        const result = await Axios.get('http://localhost:3001/dashboard');

        setTournamentRanking(result.data.tournaments);
        setPlayerRanking(result.data.players);

    },[])

    
    return (
        <div className="dashboard">
            <h2>oo</h2>

            {tournamentRanking && tournamentRanking.map((tournament) => {
                return (
                    <h1 key={tournament.idTournoi}>{tournament.nomTournoi} </h1>
                )
            })}

        </div>
    )
};


export default Dashboard; 