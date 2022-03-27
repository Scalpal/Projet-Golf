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

function AdminAddTournaments() {

    const [tournaments, setTournaments] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [fiveNextYears, setFiveNextYears] = useState([]);

    const [yearSelected, setYearSelected] = useState(0);
    const [tournamentSelected, setTournamentSelected] = useState('');

    const [error, setError ] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [success, setSuccess ] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [doExist, setDoExist ] = useState(false);
    const [existMessage, setExistMessage] = useState('');



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

        if(doExist){
            setTimeout(() => {
                setDoExist(false);
            }, 3000)
        }

        if(error){
            setTimeout(() => {
                setError(false);
            }, 3000)
        }
    }, [success,doExist,error])

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
                setDoExist(response.data.doExist);
                setExistMessage(response.data.message)
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

                    {/* {tournaments.map((tournament) => {
                        return (
                            <h1> {tournament.nomTournoi} </h1>
                        )
                    })} */}


                    <Slide
                        direction="left"
                        in={success}
                        mountOnEnter
                        unmountOnExit
                    >
                        <Alert
                            variant="filled" 
                            severity="success"
                            onClose={() => {setSuccess(false)}}
                            sx={{
                                position: "absolute",
                                top: "30px",
                                right: "30px",
                              }}
                        >
                            {successMessage}
                        </Alert>
                    </Slide>

                    <Slide
                        direction="left"
                        in={doExist}
                        transitionD
                        mountOnEnter
                        unmountOnExit
                    >
                        <Alert
                            variant="filled" 
                            severity="warning"
                            onClose={() => {setDoExist(false)}}
                            sx={{
                                position: "absolute",
                                top: "30px",
                                right: "30px",
                              }}
                        >
                            {existMessage}
                        </Alert>
                    </Slide>

                    <Slide
                        direction='left'
                        in={error}
                        mountOnEnter
                        unmountOnExit
                        timeout={1200}
                    >
                        <Alert
                            variant="filled" 
                            severity="error"
                            onClose={() => {setError(false)}}
                            sx={{
                                position: "absolute",
                                top: "30px",
                                right: "30px",
                              }}
                        >
                            {errorMessage}
                        </Alert>
                    </Slide>

                </Box>
            </Box>
        </Box>
    )
}

export default AdminAddTournaments