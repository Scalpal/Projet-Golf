import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash'; 

function AdminAddScores() {

    const [players, setPlayers] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [holes, setHoles] = useState([]);
    const [holeColors, setHoleColors] = useState([]);

    // UseState for datas to send
    const [playerSelected, setPlayerSelected] = useState('');
    const [tournamentSelected, setTournamentSelected] = useState('');
    const [yearSelected, setYearSelected] = useState(0);
    const [holeColorSelected, setHoleColorSelected] = useState('');

    const [holeOneScore , setHoleOneScore] = useState([]);
    const [holeTwoScore , setHoleTwoScore] = useState([]);
    const [holeThreeScore , setHoleThreeScore] = useState([]);
    const [holeFourScore , setHoleFourScore] = useState([]);
    const [holeFiveScore , setHoleFiveScore] = useState([]);
    const [holeSixScore , setHoleSixScore] = useState([]);
    const [holeSevenScore , setHoleSevenScore] = useState([]);
    const [holeEightScore , setHoleEightScore] = useState([]);
    const [holeNineScore , setHoleNineScore] = useState([]);

    const [message, setMessage] = useState('')

    useEffect(async() => {
        const datas = await Axios.get('http://localhost:3001/admin/tournament/addScores');

        setPlayers(datas.data.players);
        setTournaments(datas.data.tournaments);
        setHoles(datas.data.holes);
        setHoleColors(datas.data.holeColors);
    
    }, [])



    function selectTournament(tournament) {
        const idTournament = tournament.substr(0,1);
        const yearTournament = tournament.substr(2,4);

        setTournamentSelected(idTournament);
        setYearSelected(yearTournament);
    }


    async function addScores(){

        const scoreArray = [];

        scoreArray.push(holeOneScore);
        scoreArray.push(holeTwoScore);
        scoreArray.push(holeThreeScore);
        scoreArray.push(holeFourScore);
        scoreArray.push(holeFiveScore);
        scoreArray.push(holeSixScore);
        scoreArray.push(holeSevenScore);
        scoreArray.push(holeEightScore);
        scoreArray.push(holeNineScore);


        const result = await Axios.post('http://localhost:3001/admin/tournament/addScores', {
            idTournament: tournamentSelected,
            yearTournament: yearSelected,
            idPlayer: playerSelected,

            holeColor: holeColorSelected, 
            score: scoreArray,
        });

        setMessage(result.data.message);

    }

    console.log(message);


    function getInfosTournoi(idTournoi) {
        const specificTournament = [];

        tournaments.map((tournament) => {
            if(tournament.IdTournoi.includes(idTournoi)){
                specificTournament.push(tournament);
            }
        });
        return specificTournament;
    }


    console.log(tournaments);


    return (
        <div className='admin-addScores'>
            <div className='inner-container'>
                <h1 className='main-title' > Ajout des scores d'un tournoi </h1>  

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <form>

                    <select 
                        id="player" 
                        onChange={(e) => {setPlayerSelected(e.target.value)}}
                    >
                        <option value=""> Choisissez un joueur... </option>
                        {players.map((player) => {

                            const playerId = player.IdJoueur;
                            return(
                                <option
                                    value={playerId}
                                >
                                    {player.nom} {player.prenom} 
                                </option>
                            )
                        })}
                    </select>

                    <select
                        onChange={(e) => {selectTournament(e.target.value)}}
                    >
                        <option value=""> Choisissez un tournoi... </option>
                        {tournaments.map((tournament) => {
                            const tournamentObject = tournament[0];
                            const nomTournoi = tournamentObject.nomTournoi;
                            const idTournoi = tournamentObject.IdTournoi;

                            return(
                                <React.Fragment>
                                    <optgroup label={nomTournoi}>
                                        {tournament.map((object) => {

                                            const tournamentID = object.IdTournoi;
                                            const tournamentYear = object.AnneeSaison;
                                            const tournamentIdYear = tournamentID.concat('-',tournamentYear);

                                            return(
                                                <option
                                                    value={tournamentIdYear}
                                                >
                                                    {object.nomTournoi} - {object.AnneeSaison}
                                                </option>
                                            )
                                        })}
                                    </optgroup>
                                </React.Fragment>
                            )
                        })};
                    </select>
                        
                    <select 
                        onChange={(e) => {setHoleColorSelected(e.target.value)}}
                    >
                        <option> Choisissez la couleur des trous joués... </option>
                        {holeColors.map((color) => {
                            const couleur = color.Couleur;
                            return(
                                <option
                                    value={couleur}
                                > 
                                    {color.Couleur} 
                                </option>
                            )
                        })}
                    </select>

                    <label for="one"> Trou n°1 </label>
                    <input 
                        type="number"
                        name="one"
                        id="one"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleOneScore([e.target.value])}}
                        required
                    />

                    <label for="two"> Trou n°2 </label>
                    <input 
                        type="number"
                        name="two"
                        id="two"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleTwoScore([e.target.value])}}
                        required
                    />

                    <label for="three"> Trou n°3 </label>
                    <input 
                        type="number"
                        name="three"
                        id="three"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleThreeScore([e.target.value])}}
                        required
                    />

                    <label for="four"> Trou n°4 </label>
                    <input 
                        type="number"
                        name="four"
                        id="four"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleFourScore([e.target.value])}}
                        required
                    />

                    <label for="five"> Trou n°5 </label>
                    <input 
                        type="number"
                        name="five"
                        id="five"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleFiveScore([e.target.value])}}
                        required
                    />

                    <label for="six"> Trou n°6 </label>
                    <input 
                        type="number"
                        name="six"
                        id="six"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleSixScore([e.target.value])}}
                        required
                    />

                    <label for="seven"> Trou n°7 </label>
                    <input 
                        type="number"
                        name="seven"
                        id="seven"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleSevenScore([e.target.value])}}
                        required
                    />

                    <label for="eight"> Trou n°8 </label>
                    <input 
                        type="number"
                        name="eight"
                        id="eight"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleEightScore([e.target.value])}}
                        required
                    />

                    <label for="nine"> Trou n°9 </label>
                    <input 
                        type="number"
                        name="nine"
                        id="nine"
                        max={50}
                        min={0}
                        onChange={(e) => {setHoleNineScore([e.target.value])}}
                        required
                    />

                    <button
                        onClick={addScores}
                    >
                        Ajouter les scores
                        
                    </button>

                </form>
            </div>
        </div>
  ) 
}

export default AdminAddScores;