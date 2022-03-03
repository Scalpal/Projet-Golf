import  Axios  from 'axios';
import React, { useState, useEffect} from 'react';
import _ from 'lodash'

import trophee from "../assets/trophee.png";


function TournamentRanking () {

    const [tournaments, setTournaments] = useState([])
    const [tournamentsInfo, setTournamentsInfo] = useState([])
    const [players , setPlayers] = useState([])
    const [playerStats, setPlayerStats] = useState([])
    const [activeCategory, setActiveCategory] = useState('')

    const [filteredPlayerStats, setFilteredPlayerStats] = useState([]) 

    useEffect(async () => {
        document.title = "InfoGolf - Classements par tournoi";
        
        const result = await Axios.get('http://localhost:3001/tournamentRanking')

        setTournaments(result.data.tournaments)
        setTournamentsInfo(result.data.tournamentsInfo)
        setPlayers(result.data.players)
        setPlayerStats(result.data.playersPoints)
    }, [])

    // Fonction qui trie par années les scores sur le tournoi en paramètre
    function filterPlayerStatsByYear(idTournoi) {
        const filteredPlayerStats = []

        playerStats.map((array) => {
            array.map((player) => {
                if(player.IdTournoi.includes(idTournoi)){
                    filteredPlayerStats.push(player)
                }
            })
        })

        const sortedArray = _.groupBy(filteredPlayerStats, 'AnneeSaison');
        const finalArray = _.values(sortedArray)

        return finalArray;
    }

    function handleRadio (tournament) {
        setFilteredPlayerStats([]);

        const list = filterPlayerStatsByYear(tournament)
        setFilteredPlayerStats(list);

        setActiveCategory(tournament);
    }


    // Fonctions GET
    function getInfosTournoi(idTournoi) {
        const specificTournament = []

        tournaments.map((tournament) => {
            if(tournament.IdTournoi.includes(idTournoi)){
                specificTournament.push(tournament)
            }
        })
        return specificTournament;
    }

    function getInfosPlayer(idJoueur){
        const specificPlayer = [] 

        players.map((player) => {
            if(player.IdJoueur.includes(idJoueur)){
                specificPlayer.push(player)
            }
        })
        return specificPlayer;
    }



    function getCountWins(idJoueur) {

        let countWins = 0;
        const checkedArrays = []
      
        // parcours de tout les tournois joués
        tournaments.map((tournament) => {

            const scoresByTournament = filterPlayerStatsByYear(tournament.IdTournoi);
            const sameElt = _.find(checkedArrays, {'AnneeSaison': tournament.AnneeSaison, 'IdTournoi': tournament.IdTournoi});

            if (typeof sameElt === 'undefined'){

                // parcours des scores du tournoi par année (2022 puis 2023,...)
                scoresByTournament.map((score) => {

                    const tournamentWinnerID = score[0].IdJoueur;

                    // Vérification si l'id en paramètre est celui du 1er du tournoi (celui d'index 0) 
                    if(tournamentWinnerID === idJoueur){
                        countWins = countWins + 1;
                        checkedArrays.push(score[0]) 
                    }else{
                        checkedArrays.push(score[0]) 
                    }
                })
            }
        })
        return countWins;
    }






    // const wins = getCountWins("1");
    // console.log(wins);

    // const arrayou = getInfosTournoi(1);
    // const playerTest = getInfosPlayer(1);

    // console.log(playerTest);
    // console.log(arrayou);
    // console.log(players)
    // console.log(tournamentsInfo)
    // console.log(tournaments)
    // console.log(playerStats)
    //  console.log(filteredPlayerStats)

    // console.log(activeCategory)

    return (

        <div className='tournamentRanking'>
            <div className='tournamentRanking-container'>
                <h1 className='main-title'> Classements par tournoi </h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <div className='radio-container'>
                    {tournamentsInfo.map((tournament) => {
                        return (
                            <div>
                                <label 
                                    for={tournament.nomTournoi}
                                    style={activeCategory === tournament.idTournoi ? {backgroundColor: "grey", color: "white"} : {backgroundColor: "rgb(214, 214, 214)"}}
                                > 
                                    {activeCategory === tournament.idTournoi ? <i class='bx bx-check'></i> : null }
                                    {tournament.nomTournoi} 
                                </label>
                                <input 
                                    type="radio" 
                                    id={tournament.nomTournoi} 
                                    name="tournament" 
                                    value={tournament.nomTournoi} 
                                    onChange={() => {
                                        handleRadio(tournament.idTournoi)
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>


                {activeCategory ? (
                    <React.Fragment>
                        {filteredPlayerStats.map((year,index) => {
                        
                            const infoTournoi = getInfosTournoi(year[0].IdTournoi);

                            const idTournoi = infoTournoi[index].IdTournoi;
                            const anneeSaison = infoTournoi[index].AnneeSaison;
                            const tournamentKey = idTournoi.concat('-',anneeSaison);

                            return (
                                <div className='TR-table' key={tournamentKey} >
                                    <div className='TR-head'>

                                        <h2>{infoTournoi[index].nomTournoi} {infoTournoi[index].AnneeSaison}</h2>

                                        <div className='TR-th-container'>
                                            <h4>Rang</h4>
                                            <h4>Joueur</h4>
                                            <h4>Nombre de coups</h4>
                                            <h4>Score</h4>
                                        </div>

                                    </div>

                                    <div className='TR-body'>
                                        {year.map((player,rank) => {

                                            const playerInfoArray = getInfosPlayer(player.IdJoueur);
                                            const playerInfo = playerInfoArray[0];

                                            return (
                                                <div className='TR-row'>
                                                    <h4><strong>{rank+1}</strong></h4>
                                                    <h4> {playerInfo.nom} {playerInfo.prenom} </h4>
                                                    <h4> {player.nombreCoups} </h4>
                                                    <h4> {player.nombrePoints} </h4>
                                                </div> 
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </React.Fragment>
                    )
                    : (
                        <div className='unselected-container'>
                            <img src={trophee} width="100"/>
                            <h1 className='unselected-title'> Choisissez le tournoi dont vous souhaitez voir le classement !</h1>
                        </div>
                    )
                }
            </div>
        </div>            
    )
};

export default TournamentRanking;