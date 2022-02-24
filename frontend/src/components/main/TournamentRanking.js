import  Axios  from 'axios';
import { useState, useEffect} from 'react';
import _ from 'lodash'


function TournamentRanking () {


    const [activeCategory, setActiveCategory] = useState('')
    const [tournaments, setTournaments] = useState([])
    const [tournamentsInfo, setTournamentsInfo] = useState([])
    const [players , setPlayers] = useState([])
    const [playerStats, setPlayerStats] = useState([])

    const [filteredPlayerStats, setFilteredPlayerStats] = useState([]) 

    useEffect(async () => {
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

    function handleRadio (event, tournament) {
        setFilteredPlayerStats([]);
        setActiveCategory(event);

        const list = filterPlayerStatsByYear(tournament)
        setFilteredPlayerStats(list);
    }

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




    const arrayou = getInfosTournoi(1);
    const playerTest = getInfosPlayer(1);

    // console.log(playerTest);

    // console.log(arrayou);

    // console.log(players)
    // console.log(tournamentsInfo)
    // console.log(tournaments)
    // console.log(playerStats)
    //  console.log(filteredPlayerStats)

    return (

        <div className='tournamentRanking'>
            <h1>Nous somme sur la page tournament ranking</h1>

            {tournamentsInfo.map((tournament) => {
                return (
                    <div>
                        <div>
                            <label for={tournament.nomTournoi}> {tournament.nomTournoi} </label>
                            <input 
                                type="radio" 
                                id={tournament.nomTournoi} 
                                name="tournament" 
                                value={tournament.nomTournoi} 
                                onChange={(e) => {
                                    handleRadio(e.target.value, tournament.idTournoi)
                                }}
                            />
                        </div>
                    </div>
                )
            })}


            {filteredPlayerStats.map((year,index) => {
                
                const infoTournoi = getInfosTournoi(year[0].IdTournoi);

                return (
                    <table>
                        <thead> {infoTournoi[index].nomTournoi} {infoTournoi[index].AnneeSaison} </thead>
                        
                        <tbody>
                            <tr>
                                <td>Rang</td>
                                <td> Joueur </td>
                                <td> Nombre de coups </td>
                                <td> Score </td>
                            </tr>

                            {year.map((player,rank) => {

                                const playerInfoArray = getInfosPlayer(player.IdJoueur);
                                const playerInfo = playerInfoArray[0];

                                return (
                                    <tr>
                                        <td> {rank+1} </td>
                                        <td> {playerInfo.nom} {playerInfo.prenom} </td>
                                        <td> {player.nombreCoups} </td>
                                        <td> {player.nombrePoints} </td>
                                    </tr> 
                                )

                            })}
                        </tbody>
                </table>
                )
            })}

        </div>

    )
};

export default TournamentRanking;