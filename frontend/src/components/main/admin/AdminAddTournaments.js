import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

function AdminAddTournaments() {

    const [tournaments, setTournaments] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [fiveNextYears, setFiveNextYears] = useState([]);
    const [message, setMessage] = useState('');

    const [yearSelected, setYearSelected] = useState(0);
    const [tournamentSelected, setTournamentSelected] = useState('');



    useEffect(async() => {
      
        const datas = await Axios.get('http://localhost:3001/admin/tournament/create');

        setSeasons(datas.data.seasons);
        setTournaments(datas.data.tournaments);
        setFiveNextYears(getFiveNextYear());
    }, [])

    function getFiveNextYear() {
        const dateArray = [];

        for (let i = 0 ; i < 6; i++ ){
            const date = new Date().getFullYear();
            const nextDate = date + i;
            dateArray.push(nextDate);
        }
        return dateArray;
    }

    async function sendTournament () {
        const response = await Axios.post('http://localhost:3001/admin/tournament/create', {
            tournamentName: tournamentSelected,
            year: yearSelected,
        });

        setMessage(response.data.message);
    }

    return (
        <Box 
            sx={{
                width: "100%",
                backgroundColor: "rgb(230,230,230)",
                padding: "25px 25px"
            }}
        >
            <Box
                className='inner-container'
            >
                <h1 className='main-title'> Ajout d'un tournoi </h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}  
                >
                    {message ? (<h1> {message} </h1>) : null }

                    <FormControl
                        sx={{
                            width: "30%",
                            marginBottom: "30px",
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">Tournoi</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tournamentSelected}
                        label="Tournoi"
                        onChange={(e) => {setTournamentSelected(e.target.value)}}
                        >
                            {tournaments.map((tournament) => {
                                const name = tournament.nomTournoi;
                                return(
                                    <MenuItem value={name}> {name} </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <FormControl
                        sx={{
                            width: "30%",
                            marginBottom: "30px"
                        }}
                    >
                        <InputLabel id="demo-simple-select-label">Année du tournoi</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={yearSelected}
                        label="Année du tournoi"
                        onChange={(e) => {setYearSelected(e.target.value)}}
                        >
                            {fiveNextYears.map((year) => {
                                const yearSeason = year;

                                return(
                                    <MenuItem value={yearSeason}> {year} </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <Button 
                        variant="outlined"
                        onClick={sendTournament}
                    > 
                        Créer 
                    </Button>

                </Box>
            </Box>
        </Box>
    )
}

export default AdminAddTournaments