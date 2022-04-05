import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Axios from 'axios';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import SpecialAlert from './SpecialAlert';

function AdminPlayerEdit() {


    const { idJoueur } = useParams();
    const navigate = useNavigate();

    const [player, setPlayer] = useState([]);

    const [newLastName, setNewLastName] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newAdress, setNewAdress] = useState('');
    const [newPhone, setNewPhone] = useState('');

    // Alertes 
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [mediumError, setMediumError] = useState(false);
    const [mediumErrorMessage, setMediumErrorMessage] = useState('')

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(async() => {
        const response = await Axios.post('http://localhost:3001/admin/player/edit', {
            idJoueur: idJoueur,
        });

        setPlayer(response.data[0]);
    }, []);

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
    }, [success,mediumError,error]);



    function containsAnyLetter(str) {
        return /[a-zA-Z]/.test(str);
    };


    async function editPlayer () {
        if(newLastName !== '' && newFirstName !== '' && newAdress !== '' && newPhone !== ''){
            if(!containsAnyLetter(newPhone)){
                const result = await Axios.post('http://localhost:3001/admin/player/edit/confirm', {
                    idJoueur: idJoueur,
                    nom: newLastName,
                    prenom: newFirstName,
                    adresse: newAdress,
                    telephone: newPhone,
                });
    
                if(result.data.success){
                    setSuccess(true);
                    setSuccessMessage(result.data.message);

                    setTimeout(() => {
                        navigate('/admin/player/list');
                    }, 3000)
                }
        
                if(result.data.mediumError){
                    setMediumError(true);
                    setMediumErrorMessage(result.data.message);
                }
        
                if(result.data.error){
                    setError(true);
                    setErrorMessage(result.data.message);
                }
            }else{
                setError(true);
                setErrorMessage('Veuillez saisir un numéro de téléphone valide.');
            }
        }else{
            setError(true);
            setErrorMessage('Veuillez remplir tout les champs.');
        }
    }


    
    if(player){
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
                    <h1 className='main-title'> Modification des informations de {player?.prenom} {player.nom} </h1>
    
                    <ul className='separator-list'>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>

                    <Grid container spacing={2} md={6} sx={{ margin: "0 auto" }} >
                        <Grid item md={6}>

                            <FormControl sx={{width: "100%"}}>
                                <OutlinedInput 
                                    placeholder={player.nom}
                                    onChange={(e) => {setNewLastName(e.target.value)}}
                                    inputProps={{ minLength: 3 ,maxLength : 30}}
                                    sx={{
                                        marginBottom: "20px",
                                    }}
                                /> 
                            </FormControl>
                        </Grid> 

                        <Grid item md={6}>
                            <FormControl sx={{width: "100%"}}>
                                <OutlinedInput 
                                    placeholder={player.prenom} 
                                    onChange={(e) => {setNewFirstName(e.target.value)}}
                                    inputProps={{ minLength: 3 ,maxLength : 30}}
                                    sx={{
                                        marginBottom: "20px",
                                    }}
                                /> 
                            </FormControl>
                        </Grid>

                        <Grid item md={6}>
                            <FormControl sx={{width: "100%"}}>
                                <OutlinedInput 
                                    placeholder={player.adresse}
                                    onChange={(e) => {setNewAdress(e.target.value)}}
                                    inputProps={{ minLength: 8 ,maxLength : 100}}
                                    sx={{
                                        marginBottom: "20px",
                                    }}
                                /> 
                            </FormControl>
                        </Grid>

                        <Grid item md={6}>
                            <FormControl sx={{width: "100%"}}>
                                <OutlinedInput 
                                    placeholder={player.telephone} 
                                    onChange={(e) => {setNewPhone(e.target.value)}}
                                    inputProps={{ minLength: 1 ,maxLength : 10}}
                                    sx={{
                                        marginBottom: "20px",
                                    }}
                                /> 
                            </FormControl>
                        </Grid>

                        <Grid item md={6} sx={{ margin: "0 auto" }} >
                            <Button 
                                variant="contained"
                                color="success"
                                onClick={editPlayer}
                            >
                                Confirmer la modification
                            </Button>
                        </Grid>
                    </Grid>

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
        )
    }
}

export default AdminPlayerEdit