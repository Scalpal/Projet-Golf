import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Axios from 'axios';
import { Box, Menu } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SpecialAlert from './SpecialAlert';
import _ from 'lodash'; 

function AdminAddScores() {

    const [players, setPlayers] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [holes, setHoles] = useState([]);
    const [ playingDates, setPlayingDates ] = useState([]);
    const [ tournamentPlayingDates, setTournamentPlayingDates ] = useState([]);

    const [inputList, setInputList] = useState([{idTrou: 1,day: "1", score: 0}]);

    // Alertes 
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [mediumError, setMediumError] = useState(false);
    const [mediumErrorMessage, setMediumErrorMessage] = useState('')

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    // UseState for datas to send
    const [playerSelected, setPlayerSelected] = useState(0);
    const [tournamentSelected, setTournamentSelected] = useState(0);
    const [yearSelected, setYearSelected] = useState(0);

    useEffect(async() => {
        const datas = await Axios.get('http://localhost:3001/admin/tournament/addScores');

        setPlayers(datas.data.players);
        setTournaments(datas.data.tournaments);
        setHoles(datas.data.holes);
        setPlayingDates(datas.data.playingDates);

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

    function handleSelectTournament(tournament) {
        const idTournament = tournament.substr(0,1);
        const idTournamentInt = parseInt(idTournament);

        const yearTournament = tournament.substr(2,4);
        const yearTournamentInt = parseInt(yearTournament);

        const tournamentPlayingDates = getTournamentPlayingDates(yearTournamentInt,idTournamentInt);

        setTournamentSelected(idTournamentInt);
        setYearSelected(yearTournamentInt);
    
        setTournamentPlayingDates(tournamentPlayingDates);
    }

    function getInfosTournoi(idTournoi) {
        const specificTournament = [];

        tournaments.map((tournament) => {
            if(tournament.IdTournoi.includes(idTournoi)){
                specificTournament.push(tournament);
            }
        });
        return specificTournament;
    }

    function getTournamentPlayingDates(yearTournament, idTournament){
        const datesArray = []; 

        playingDates.map((date) => {
            if(date.AnneeSaison === yearTournament && date.IdTournoi === idTournament){
                datesArray.push(date);
            }
        })

        return datesArray;
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    const handleAddClick = (index) => {

        if (inputList[index-1]){

            const previousInputDay = inputList[index].day;
            console.log(previousInputDay);

            setInputList([...inputList, { idTrou: index+2, day: previousInputDay, score: "" }]);
        }else{
            setInputList([...inputList, { idTrou: index+2, day: "1", score: "" }]);

        }
    };

    async function addScores(){

        const result = await Axios.post('http://localhost:3001/admin/tournament/addScores', {
            idTournament: tournamentSelected,
            yearTournament: yearSelected,
            idPlayer: playerSelected,

            score: inputList,
        });

        console.log(result)

        if(result.data.success){
            setSuccess(result.data.success);
            setSuccessMessage(result.data.message)
        }

        if(result.data.mediumError){
            setMediumError(result.data.mediumError);
            setMediumErrorMessage(result.data.message)
        }

        if(result.data.error){
            setError(result.data.error)
            setErrorMessage(result.data.message);
        }
    }

    // console.log(mediumError)
    // console.log(playerSelected);
    // console.log(tournamentSelected);
    // console.log(yearSelected);

    // console.log(typeof playerSelected)
    // console.log(typeof tournamentSelected);
    // console.log(typeof yearSelected)
    // console.log(playingDates)
    // console.log(tournamentPlayingDates);

    // console.log(holeOneScore)
    // console.log(typeof holeOneScore)


    return (
        <Box className='admin-addScores'>
            <Box className='inner-container'>
                <h1 className='main-title' > Ajout des scores </h1>  

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                {error && <h3> {errorMessage} </h3>}

                <Grid 
                    container 
                    xs={12} 
                    direction="column" 
                    sx={{
                        padding: "15px 15px 15px 0px"
                    }}
                >
                    
                    <Grid 
                        container item
                        xs={4}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            marginBottom: "30px"
                        }}
                    >
                        {/* Select des joueurs */}
                        <Grid 
                            item 
                            md={12}
                        >
                            <FormControl
                                sx={{
                                    width: "100%",
                                    marginBottom: "30px",
                                }}
                            >
                                <InputLabel id="demo-simple-select-label">Joueur</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={playerSelected}
                                    label="Joueur"
                                    required
                                    placeholder='Choisissez un joueur'
                                    onChange={(e) => {setPlayerSelected(e.target.value)}}
                                    sx={{
                                        minWidth: "200px",
                                    }}
                                >   
                                    {players.map((player) => {
                                        const playerId = player.idJoueur;
                                    return(
                                            <MenuItem value={playerId}> {player.nom} {player.prenom} </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {/* Select des tournois  */}
                        <Grid item xs={12} sx={{ marginBottom: "30px" }}>
                            <select
                                id="tournament"
                                className='select-tournament-score'
                                onChange={(e) => {handleSelectTournament(e.target.value)}}
                            >
                                <option value=""> Choisissez un tournoi... </option>
                                {tournaments.map((tournament) => {
                                    const tournamentObject = tournament[0];
                                    const nomTournoi = tournamentObject.nomTournoi;

                                    return(
                                        <optgroup label={nomTournoi}>
                                            {tournament.map((object) => {

                                                const tournamentID = object.IdTournoi;
                                                const tournamentYear = object.AnneeSaison;
                                                const tournamentIdYear = tournamentID.toString().concat('-',tournamentYear.toString());

                                                return(
                                                    <option
                                                        key={tournamentIdYear}
                                                        value={tournamentIdYear}
                                                    >
                                                        {object.nomTournoi} - {object.AnneeSaison}
                                                    </option>
                                                )
                                            })}
                                        </optgroup>
                                    )
                                })};
                            </select>
                        </Grid>
                    </Grid>



                    
                    <Grid 
                        container 
                        item
                        spacing={2}
                        xs={12}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{
                            marginLeft: "0px !important",
                        }}
                    >
                        {inputList.map((input, index) => {
                            const composedKeyHole = "trou"+"-"+index;
                            
                            return(
                                <Grid 
                                    item 
                                    display="flex"
                                    direction="column"
                                    justifyContent="space-between"
                                    key={composedKeyHole}
                                    xs={3.7}
                                    sx={{
                                        backgroundColor: "rgb(181, 181, 181)",
                                        padding: "12px !important",
                                        borderRadius: "15px",
                                        marginLeft: "15px",
                                        marginBottom: "15px"
                                    }}
                                >
                                    <label> Trou n°{index+1} </label>
                                    <input 
                                        type="number"
                                        name="score"
                                        placeholder='Nombre de coups'
                                        max={50}
                                        min={0}
                                        onChange={(e) => {handleInputChange(e,index)}}
                                        required
                                        className='input-number-score'
                                    />

                                    {index === 0 ? (
                                        <React.Fragment>
                                            <label> Choisissez le jour </label>
                                            <select
                                                name="day"
                                                onChange={(e) => {handleInputChange(e, index)}}
                                                className='input-select-score'
                                                disabled
                                                required
                                            >
                                                {tournamentPlayingDates.map((date, i) => {
                                                    const day = date.Jour;
                                                    const specificDate = date.date;
                                                    const specificDateCut = specificDate.substr(0,10);

                                                    console.log(specificDateCut)
                                                    return(
                                                        <option value={day}> Jour {day} - {specificDateCut} </option>
                                                    )
                                                })}
                                            </select>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <label> Choisissez le jour  </label>
                                            <select
                                                name="day"
                                                onChange={(e) => {handleInputChange(e, index)}}
                                                className='input-select-score'
                                                value={input.day}
                                                required
                                            >
                                                <option selected="selected"> Choisissez un jour... </option>

                                                {tournamentPlayingDates.map((date, i) => {
                                                    const day = date.Jour;
                                                    const previousInputDayInt = parseInt(inputList[index-1].day);

                                                    const specificDate = date.date;
                                                    const specificDateCut = specificDate.substr(0,10);

                                                    return(
                                                        day >= previousInputDayInt ? (
                                                            <option value={day}> Jour {day} - {specificDateCut}</option>
                                                        ) : ( 
                                                            null 
                                                        )
                                                    )
                                                })}
                                            </select>
                                        </React.Fragment>
                                    )}

                                    <Grid 
                                        item 
                                        xs={3.7}
                                        display="flex"
                                        justifyContent="center"
                                    > 
                                        {inputList.length - 1 === index && 
                                        inputList.length < 9 
                                        && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => {handleAddClick(index)}}
                                                disabled={!inputList[index].score && inputList[index].score === 0}
                                                sx={{
                                                    margin: "15px auto 0 auto"
                                                }}
                                            >
                                                Trou suivant 
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>

                    {/* <h3> {JSON.stringify(inputList)} </h3> */}

                    <Grid 
                        item 
                        xs={3}
                        sx={{
                            margin:"0 auto"
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            onClick={addScores}
                            disabled={inputList.length < 9}
                        >
                            Ajouter les scores
                        </Button>

                        
                        <SpecialAlert 
                            success={success}
                            successMessage={successMessage}

                            mediumError={mediumError}
                            mediumErrorMessage={mediumErrorMessage}

                            error={error}
                            errorMessage={errorMessage}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
  ) 
}

export default AdminAddScores;