import Axios from 'axios';
import { useState, useEffect } from 'react';
import _ from 'lodash';


function Players () {

    const [players, setPlayers] = useState([]);
    const [ playerStats , setPlayerStats ] = useState([]);
    const [ tournaments, setTournaments] = useState([]);
    const [ tournamentsInfo, setTournamentsInfo ] = useState([]);
    const [ searchedName, setSearchedName ] = useState('');
 
    useEffect( async() => {

        const datas = await Axios.get('http://localhost:3001/tournamentRanking');

        setPlayers(datas.data.players);
        setPlayerStats(datas.data.playersPoints);
        setTournaments(datas.data.tournaments);
        setTournamentsInfo(datas.data.tournamentsInfo);
    }, [])

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

    function getTournamentsWon(idJoueur) {

        const tournamentsWon = []
        const checkedArrays = []
      
        // parcours de tout les tournois joués
        tournaments.map((tournament) => {

            const scoresByTournament = filterPlayerStatsByYear(tournament.IdTournoi);
            const sameElt = _.find(checkedArrays, {'AnneeSaison': tournament.AnneeSaison, 'IdTournoi': tournament.IdTournoi});

            if (typeof sameElt === 'undefined'){

                // parcours des scores du tournoi par année (2022 puis 2023,...)
                scoresByTournament.map((score) => {

                    const tournamentWinnerID = score[0].IdJoueur;
                    const theTournament = getInfosTournoiByIdYear(score[0].IdTournoi, score[0].AnneeSaison);
                    
                    // Vérification si l'id en paramètre est celui du 1er du tournoi (celui d'index 0) 
                    if(tournamentWinnerID === idJoueur){
                        tournamentsWon.push(theTournament[0]);
                        checkedArrays.push(score[0]) 
                    }else{
                        checkedArrays.push(score[0]) 
                    }
                })
            }
        })
        return tournamentsWon;
    }

    function isValueContained (stringToTest,secondString, inputValue) {

        if(
           (stringToTest.toUpperCase().includes(inputValue.toUpperCase()) || stringToTest.toLowerCase().includes(inputValue.toLowerCase())) 
           || 
           (secondString.toUpperCase().includes(inputValue.toUpperCase()) || secondString.toLowerCase().includes(inputValue.toLowerCase())) 

        ){
            return true;
        }
    }


    // Fonction GET
    function getInfosTournoiByIdYear(idTournoi,anneeSaison) {
        const specificTournament = []

        tournaments.map((tournament) => {
            if( tournament.IdTournoi.includes(idTournoi) && tournament.AnneeSaison === (anneeSaison) ){
                specificTournament.push(tournament)
            }
        })
        return specificTournament;
    }






    return (

        <div className='playerStats'>
            <h1> Je suis sur la page players </h1>

            <input 
                type="text" 
                onChange={(e) => {setSearchedName(e.target.value)}}
            />
            
            <div className='card-container'>
                {players.map((player) => {

                    const tournamentsWon = getTournamentsWon(player.IdJoueur);
                    // console.log(player.IdJoueur)

                    return(
                        isValueContained(player.nom, player.prenom, searchedName) ? (

                            <div className='card' key={player.nom}>
                                <h1> {player.nom} {player.prenom} </h1>
                                <h3> {player.adresse} </h3>
                                <h3> {player.telephone} </h3>
                                <h3> {player.anniversaire.substr(0,10)} </h3>
                                <h3> Les tournois gagnés </h3>

                                {tournamentsWon.map((tournament) => {
                                    return (
                                        <h4> {tournament.nomTournoi} {tournament.AnneeSaison}</h4>
                                    )
                                })}
                                
                            </div>

                        ) : (
                        null
                        )
                    )        
                })}
            </div>
        </div>
    )
};


export default Players;