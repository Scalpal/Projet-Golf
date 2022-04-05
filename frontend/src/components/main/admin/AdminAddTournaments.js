import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import SpecialAlert from './SpecialAlert';

function AdminAddTournaments() {

    const [tournaments, setTournaments] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [fiveNextYears, setFiveNextYears] = useState([]);

    const [yearSelected, setYearSelected] = useState(0);
    const [tournamentSelected, setTournamentSelected] = useState('');

    // Alertes


    const [success, setSuccess ] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [mediumError, setMediumError ] = useState(false);
    const [mediumErrorMessage, setMediumErrorMessage] = useState('');

    const [error, setError ] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');




    useEffect(async() => {
      
        const datas = await Axios.get('http://localhost:3001/admin/tournament/create');

        setSeasons(datas.data.seasons);
        setTournaments(datas.data.tournaments);
        setFiveNextYears(getFiveNextYear());
    }, [])

    useEffect(() => {
        if(success){
            setTimeout(() => {
                setSuccess(false);
            }, 3000)
        }

        if(mediumError){
            setTimeout(() => {
                setMediumError(false);
            }, 3000)
        }

        if(error){
            setTimeout(() => {
                setError(false);
            }, 3000)
        }
    }, [success,mediumError,error])

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

        if(yearSelected && tournamentSelected){
            const response = await Axios.post('http://localhost:3001/admin/tournament/create', {
                tournamentName: tournamentSelected,
                year: yearSelected,
            });
            
            console.log(response.data)
            if(response.data.doExist){
                setMediumError(response.data.doExist);
                setMediumErrorMessage(response.data.message)
            }else{
                setSuccess(true);
                setSuccessMessage(response.data.message);
            }
        }else{
            setError(true);
            setErrorMessage("Veuillez remplir tout les champs.");
        }
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
                            required
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
                            required={true}
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
                        variant="contained"
                        color="success"
                        onClick={sendTournament}
                    > 
                        Créer 
                    </Button>

                    <SpecialAlert 
                        success={success}
                        successMessage={successMessage}

                        mediumError={mediumError}
                        mediumErrorMessage={mediumErrorMessage}

                        error={error}
                        errorMessage={errorMessage}
                    />

                </Box>
            </Box>
        </Box>
    )
}

export default AdminAddTournaments