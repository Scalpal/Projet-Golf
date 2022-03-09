import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import ReactToolTip from 'react-tooltip';
import Tilt from 'react-parallax-tilt'

import placeholderImg from '../assets/placeholder.jpeg';



function Players () {

    const [players, setPlayers] = useState([]);
    const [ playerStats , setPlayerStats ] = useState([]);
    const [ tournaments, setTournaments] = useState([]);
    const [ tournamentsInfo, setTournamentsInfo ] = useState([]);
    const [ tournamentsPlayed, setTournamentsPlayed ] = useState([]);
    const [ searchedName, setSearchedName ] = useState('');
 
    useEffect( async() => {

        const datas = await Axios.get('http://localhost:3001/tournamentRanking');

        setPlayers(datas.data.players);
        setPlayerStats(datas.data.playersPoints);
        setTournaments(datas.data.tournaments);
        setTournamentsInfo(datas.data.tournamentsInfo);
        setTournamentsPlayed(datas.data.tournamentsPlayed);

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

    function badgeColor(tournamentID) {

        const style = {};

        if (tournamentID === "1" ){
            style.backgroundColor = "rgb(39,93,50)"
            style.borderRadius = "15px";
            style.padding = "5px 10px";
            style.color = "white";
            style.marginBottom = "15px";
        }else if(tournamentID === "2"){
            style.backgroundColor = "rgb(6,23,84)"
            style.borderRadius = "15px";
            style.padding = "5px 10px";
            style.color = "white";
            style.marginBottom = "15px";
        }else if (tournamentID === "3"){
            style.backgroundColor = "rgb(20,55,114)"
            style.borderRadius = "15px";
            style.padding = "5px 10px";
            style.color = "white";
            style.marginBottom = "15px";
        }else{
            style.backgroundColor = "rgb(173,151,96)"
            style.borderRadius = "15px";
            style.padding = "5px 10px";
            style.color = "white";
            style.marginBottom = "15px";
        }

        return style;
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

    function getTournamentsPlayed(playerID) {

        const tournamentsPlayedByPlayer = []

        tournamentsPlayed.map((participation) => {

            if(participation.IdJoueur.includes(playerID)){
                tournamentsPlayedByPlayer.push(participation)
            }
        })

        return tournamentsPlayedByPlayer;
    }


    // Fonction pour mettre le numéro de tél au format FR 
    function formatFrenchPhoneNumber(number) {
        return number.split('').join(' ').replace(/([0-9]) ([0-9])\b/g, '$1$2');
    }


    console.log(tournamentsPlayed)


    return (

        <div className='players'>
            <div className='inner-container'>

                <h1 className='main-title'> Les joueurs </h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <p style={{textAlign: "center"}} > Vous souhaiter connaître les joueurs qui ont participés aux tournois ou simplement en savoir plus 
                    sur eux ? <br/>
                    Trouvez-les grâce à la barre de recherche ! 
                </p>

                <input 
                    type="text" 
                    onChange={(e) => {setSearchedName(e.target.value)}}
                    placeholder="Rechercher..."
                />
                
                <div className='card-container'>


                    {players.map((player) => {
                        const tournamentsWon = getTournamentsWon(player.IdJoueur);
                        const tournamentsPlayed = getTournamentsPlayed(player.IdJoueur);

                        const phoneNumberFr = formatFrenchPhoneNumber(player.telephone);
                        // const adresse = player.adresse;
                        // const birthDate = player.anniversaire.substr(0,10);
                        // const playerInfos = adresse + "<br/>" + phoneNumberFr + "<br/>" + birthDate;

                        return(
                            isValueContained(player.nom, player.prenom, searchedName) ? (
                                <Tilt 
                                    className='card' 
                                    key={player.IdJoueur}
                                    tiltMaxAngleX={20}
                                    tiltMaxAngleY={20}
                                    perspective={1000}
                                    transitionSpeed={1000}
                                    scale={1.050}
                                    gyroscope={true}                              
                                >
                                    <div className='background-color-block-top'></div>

                                    <div className="placeholder-picture">
                                        <img src={placeholderImg}/>
                                    </div>

                                    <div className='playerInfos-container' >
                                        <h2 style={{textAlign: "center"}} > {player.nom} {player.prenom} </h2>

                                        <h3> <i class='bx bx-current-location'></i> {player.adresse} </h3>
                                        <h3> <i class='bx bxs-phone'></i> {phoneNumberFr} </h3>
                                        <h3> <i class='bx bx-calendar-plus'></i> {player.anniversaire.substr(0,10)} </h3>
                                        <h3> Nombre de participations à des tournois : {tournamentsPlayed.length} </h3>
                                    </div>

                                    <div className='separator'></div>

                                    <details>
                                        <summary> Tournois gagnés </summary>
                                        
                                        <div className='tournamentsWon-container' >
                                        {tournamentsWon.length > 0 ? (
                                            <React.Fragment>
                                                {tournamentsWon.map((tournament) => {
                                                    return (
                                                        <div 
                                                            style={badgeColor(tournament.IdTournoi)} 
                                                            className="tournamentsWon-container"
                                                        >
                                                            {tournament.nomTournoi} - {tournament.AnneeSaison}
                                                        </div>
                                                    )
                                                })}
                                            </React.Fragment>
                                            )
                                            : (
                                                <h4>Aucun tournois gagnés</h4>
                                            )
                                        }
                                        </div>
                                    </details>
                                <ReactToolTip id={player.IdJoueur} multiline={true} />
                            </Tilt>
                            ) : (
                            null
                            )
                        )        
                    })}
                </div>
            </div>
        </div>
    )
};


export default Players;