import { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import placeholderImg from '../assets/placeholder.jpeg';

function Dashboard () {


    const [tournaments, setTournaments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [ threeBestPlayers, setThreeBestPlayers ] = useState([]);


    useEffect (async () => {
        const result = await Axios.get('http://localhost:3001/dashboard');

        setTournaments(result.data.tournaments);
        setPlayers(result.data.players);
        setThreeBestPlayers(result.data.threeBestPlayers);

    },[setTournaments, setPlayers, setThreeBestPlayers, Axios]);

    function ratioCalculate(nbParticipations, nbVictoires){

        let ratio = 100 * nbVictoires / nbParticipations; 

        return ratio;
    }


    return (
        <Box 
            className="dashboard"
            sx={{
                width: "100%",
                backgroundColor: "rgb(230,230,230)",
                padding: "25px 25px",
            }}
        >
            <Box className='inner-container'>

                <Grid container spacing={1}
                    sx={{
                        height: "calc(100vh - 33rem)",
                        padding: "10px",
                        flex: "1"
                    }}
                    direction="row"
                    justifyContent="space-between"
                >

                    {/* Joueur top 2 */}
                    <Grid container item
                        direction="column"
                        justifyContent="center"
                        xs={3.7}
                        sx={{
                            padding: "0px !important"
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "15px",
                                padding: "15px 10px 10px 10px",
                                backgroundColor:"rgb(196,202,206)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                transition:" all 0.3s cubic-bezier(.25,.8,.25,1)",
                                '&:hover': {
                                    boxShadow:"0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                                }
                            }}
                            direction="column"
                        >
                            <div 
                                className='center-element'
                            >
                                <img
                                    src={placeholderImg}
                                    style={{
                                        borderRadius: "50%",
                                        height: "100px",
                                        width: "100px",
                                        margin: "0 auto"
                                    }}
                                />
                            </div>

                            <h1
                                className='card-player-name'                            
                            > 
                                {threeBestPlayers[1]?.nom} {threeBestPlayers[1]?.prenom} 
                            </h1>

                            <h3
                                className='card-player-stats'                        
                            >
                                {threeBestPlayers[1]?.nbParticipations} participations 
                            </h3>

                            <h3
                                className='card-player-stats'
                            > 
                                Ratio participation/victoires : {ratioCalculate(threeBestPlayers[1]?.nbParticipations, threeBestPlayers[1]?.wins)}%
                            </h3>

                            <h2
                                className='card-player-wons'
                                style={{
                                    color: "rgb(196,202,206)"
                                }}
                            >
                                {threeBestPlayers[1]?.wins} tournois remportés
                            </h2>

                        </Box>
                    </Grid>

                    {/* Joueur top 1 */}
                    <Grid container item
                        direction="column"
                        justifyContent="flex-start"
                        xs={3.7}
                        sx={{
                            padding: "0px !important",
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "15px",
                                padding: "15px 10px 10px 10px",
                                backgroundColor:"rgb(255,215,0)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                transition:" all 0.3s cubic-bezier(.25,.8,.25,1)",
                                '&:hover': {
                                    boxShadow:"0px 0px 11px 8px rgba(255,215,0,0.86);",
                                    border: "2px solid rgb(255,215,0)"
                                }
                            }}
                            direction="column"
                            alignItems="center"
                        >  
                            <div className='center-element'>
                                <i 
                                    className="bx bxs-crown"
                                    style={{
                                        fontSize: "3em",
                                        textAlign: "center"
                                    }}
                                >
                                </i>
                            </div>
                        
                            <div className='center-element'>
                                <img
                                    src={placeholderImg}
                                    style={{
                                        borderRadius: "50%",
                                        height: "100px",
                                        width: "100px",
                                        margin: "10px auto 0 auto"
                                    }}
                                />
                            </div>
                          
                            <h1
                                className='card-player-name'
                            > 
                                {threeBestPlayers[0]?.nom} {threeBestPlayers[0]?.prenom} 
                            </h1>

                            <h3
                                className='card-player-stats'
                            >
                                {threeBestPlayers[0]?.nbParticipations} participations 
                            </h3>

                            <h3
                                className='card-player-stats'
                            > 
                                Ratio participation/victoires : {ratioCalculate(threeBestPlayers[0]?.nbParticipations, threeBestPlayers[0]?.wins)}%
                            </h3>

                            <h2
                                className='card-player-wons'
                                style={{
                                    color: "rgb(255,215,0)"
                                }}
                            >
                                {threeBestPlayers[0]?.wins} tournois remportés
                            </h2>
                        </Box>
                    </Grid>

                    {/* Joueur top 3 */}
                    <Grid container item
                        direction="column"
                        justifyContent="flex-end"
                        xs={3.7}
                        sx={{
                            padding: "0px !important"
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "15px",
                                padding: "15px 10px 10px 10px",
                                backgroundColor:"rgb(205,127,50)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                transition:" all 0.3s cubic-bezier(.25,.8,.25,1)",
                                '&:hover': {
                                    boxShadow:"0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                                }
                            }}
                            direction="column"
                        >
                            <div 
                                className='center-element'
                            >
                                <img
                                    src={placeholderImg}
                                    style={{
                                        borderRadius: "50%",
                                        height: "100px",
                                        width: "100px",
                                        margin: "0 auto"
                                    }}
                                />
                            </div>

                            <h1
                                className='card-player-name'
                            > 
                                {threeBestPlayers[2]?.nom} {threeBestPlayers[2]?.prenom} 
                            </h1>

                            <h3
                                className='card-player-stats'
                            >
                                {threeBestPlayers[2]?.nbParticipations} participations 
                            </h3>


                            <h3
                                className='card-player-stats'
                            > 
                                Ratio participation/victoires : {ratioCalculate(threeBestPlayers[2]?.nbParticipations, threeBestPlayers[2]?.wins)}%
                            </h3>

                            <h2
                                className='card-player-wons'
                                style={{
                                    color: "rgb(205,127,50)"
                                }}
                            >
                                {threeBestPlayers[2]?.wins} tournois remportés
                            </h2>

                        </Box>
                    </Grid>
                </Grid>

            </Box>
        </Box>
    )
};


export default Dashboard; 