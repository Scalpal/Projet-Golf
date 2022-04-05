import  Axios  from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import _ from 'lodash'

import trophee from "../assets/trophee.png";


function TournamentRanking () {

    const { gender } = useParams();

    const [tournaments, setTournaments] = useState([])
    const [tournamentsInfo, setTournamentsInfo] = useState([])
    const [players , setPlayers] = useState([])
    const [playerStats, setPlayerStats] = useState([])
    const [activeCategory, setActiveCategory] = useState(0);


    const [tournamentPlayersStatsSum , setTournamentPlayersStatsSum ] = useState([]);

    // UseState pour fonction useCallback
    const [ playerStatsByIdPlayer, setPlayerStatsByIdPlayer ] = useState([]);
    const [ tournamentScoresSum, setTournamentScoresSum] = useState([]);

    useEffect(async () => {
        document.title = "InfoGolf - Classements par tournoi";
        
        const result = await Axios.get(`http://localhost:3001/tournamentRanking/${gender}`);

        setTournaments(result.data.tournaments)
        setTournamentsInfo(result.data.tournamentsInfo)
        setPlayers(result.data.players)
        setPlayerStats(result.data.playersPoints)

    }, [setTournaments, setTournamentsInfo, setPlayers, setPlayerStats, gender, Axios])

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }));
      


    const filteredPlayersScoreByYear = useMemo(() => {
        const arrayStats = [];

        playerStats.map((array) => {
            array.map((player) => {
                if(player.IdTournoi === (activeCategory)){
                    arrayStats.push(player)
                }
            })
        })
        const sortedArray = _.groupBy(arrayStats, 'AnneeSaison');
        const finalArray = _.values(sortedArray);

        return finalArray;

      }, [playerStats, activeCategory],
    )

    // Scores triés par Id du joueur
    const filteredScoresOfTournamentByIdPlayer = useMemo(() => {
        const scoresGroupedByIdPlayer = []; 

        filteredPlayersScoreByYear.map((yearScores) => {
            const groupedByIdPlayer = _.groupBy(yearScores, 'IdJoueur');
            const flattenedArray = _.values(groupedByIdPlayer);
            
            scoresGroupedByIdPlayer.push(flattenedArray);
        })

        return scoresGroupedByIdPlayer;
      },
      [filteredPlayersScoreByYear]
    )

    // Somme des scores
    const sumOfScores = useMemo(() => {
        const sumScoresArray = [];

        // Parcours des années
        filteredScoresOfTournamentByIdPlayer.map((yearScores) => {

            // Parcours des scores de l'année 
            yearScores.map((playerScores) => {

                var totalCoups = 0;
                var totalPoints = 0;

                // Parcours des scores pour faire la somme 
                playerScores.map((score) => {
                    totalCoups = totalCoups + score.nbCoups;
                    totalPoints = totalPoints + score.nbPoints; 
                }) 

                sumScoresArray.push({
                    IdJoueur: playerScores[0].IdJoueur,
                    IdTournoi: playerScores[0].IdTournoi,
                    AnneeSaison: playerScores[0].AnneeSaison,
                    nbCoups: totalCoups,
                    nbPoints: totalPoints,
                })
            })
        })
        const scoresGroupByYear = _.groupBy(sumScoresArray, 'AnneeSaison');
        const finalScoresArray = _.values(scoresGroupByYear);

        return finalScoresArray;
    }, [filteredScoresOfTournamentByIdPlayer]
    )

    // Scores des jouers triés par jour (les scores du même jour ne sont pas encore additionnés)
    const playerScoresSortedByDay = useMemo(() => {

        const finalArray = []; 

        filteredScoresOfTournamentByIdPlayer.map((yearScores) => {
            yearScores.map((scores) => {
                const scoresGroupedByDay = _.groupBy(scores, 'jour');
                const dayScores = _.values(scoresGroupedByDay);
                finalArray.push(dayScores);
            })
        })

        return finalArray;
    }, [filteredScoresOfTournamentByIdPlayer]
    )

    // console.log(playerScoresSortedByDay);

    const playerScoresSortedByDayAdded = useMemo(() => {
        const scoresArray = [];

        playerScoresSortedByDay.map((playerScore) => {
            playerScore.map((scoreOfDay) => {

                var nbCoups = 0;
                var nbPoints = 0;
                var jour= 0;
                var countScoresOfDay = 0;

                scoreOfDay.map((scores) => {
                    nbCoups = nbCoups + scores.nbCoups;
                    nbPoints = nbPoints + scores.nbPoints;
                    jour = scores.jour;
                    countScoresOfDay = countScoresOfDay + 1 ;
                })
                scoresArray.push({
                    jour: jour,
                    nombreTrousJoues: countScoresOfDay,
                    AnneeSaison: scoreOfDay[0].AnneeSaison,
                    IdJoueur: scoreOfDay[0].IdJoueur,
                    IdTournoi: scoreOfDay[0].IdTournoi,
                    nbCoups: nbCoups,
                    nbPoints: nbPoints,
                })
            })
        })

        const groupedScoresByYear = _.groupBy(scoresArray, 'AnneeSaison');
        const finalArray = _.values(groupedScoresByYear);

        return finalArray;
    },[playerScoresSortedByDay]
    ) 


    // Fonctions GET
    function getInfosTournoi(idTournoi) {
        const specificTournament = []

        tournaments.map((tournament) => {
            if(tournament.IdTournoi === (idTournoi)){
                specificTournament.push(tournament)
            }
        })
        return specificTournament;
    }

    function getInfosPlayer(idJoueur){
        const specificPlayer = [] 

        players.map((player) => {
            if(player.idJoueur === idJoueur){
                specificPlayer.push(player)
            }
        })
        return specificPlayer;
    }

    function getPlayerScoresByDay(index, idJoueur) {
        const dayScores = [];

        playerScoresSortedByDayAdded[index].map((day) => {
            if(day.IdJoueur === idJoueur){
                dayScores.push(day);
            }
        })

        return dayScores;
    }

    
    console.log(sumOfScores)




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
    // console.log(filteredPlayerStats)

    // console.log(activeCategory)

    // console.log(playerStats);

    console.log(sumOfScores);
    
    return (
        <div className='tournamentRanking'>
            <div className='inner-container'>
                <h1 className='main-title'> Classements : Catégorie {gender}</h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <div className='radio-container'>
                    {tournamentsInfo.map((tournament) => {

                        return (
                            <div key={tournament.IdTournoi}>
                                <label 
                                    for={tournament.nomTournoi}
                                    style={activeCategory === tournament.IdTournoi ? {backgroundColor: "grey", color: "white"} : {backgroundColor: "rgb(214, 214, 214)"}}
                                > 
                                    {activeCategory === tournament.IdTournoi ? <i class='bx bx-check'></i> : null }
                                    {tournament.nomTournoi} 
                                </label>
                                <input 
                                    type="radio" 
                                    id={tournament.nomTournoi} 
                                    name="tournament" 
                                    value={tournament.nomTournoi} 
                                    onChange={() => {
                                        setActiveCategory(tournament.IdTournoi)
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>


                {activeCategory ? (
                    <React.Fragment>

                        {/* Parcours des saisons du tournoi selectionné */}
                        {sumOfScores.map((scoresOfYear,index) => {
                  
                            const infoTournoi = getInfosTournoi(scoresOfYear[0].IdTournoi);

                            const idTournoi = infoTournoi[index].IdTournoi;
                            const anneeSaison = infoTournoi[index].AnneeSaison;
                            const tournamentKey = idTournoi+'-'+anneeSaison;

                    
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
                                        {/* Parcours des scores par année du tournoi selectionné */}
                                        {scoresOfYear.map((playerScore,rank) => {

                                            const playerInfoArray = getInfosPlayer(playerScore.IdJoueur);
                                            const playerInfo = playerInfoArray[0];

                                            const dayScoresOfPlayer = getPlayerScoresByDay(index,playerScore.IdJoueur);

                                            return (
                                                <React.Fragment>
                                                    <HtmlTooltip
                                                        title={
                                                            dayScoresOfPlayer.map((day) => {
                                                                return (
                                                                    <p> Jour {day.jour} : {day.nbPoints} </p>
                                                                )
                                                            })
                                                        }
                                                    >
                                                        <div className='TR-row'>
                                                            <h4><strong>{rank+1}</strong></h4>
                                                            <h4> {playerInfo.nom} {playerInfo.prenom} </h4>
                                                            <h4> {playerScore.nbCoups} </h4>
                                                            <h4> {playerScore.nbPoints} </h4>
                                                    
                                                        </div> 
                                                    </HtmlTooltip>
                                                </React.Fragment>
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