import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import SpecialAlert from './SpecialAlert';

function AdminRegister() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // Alertes 
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [mediumError, setMediumError] = useState(false);
    const [mediumErrorMessage, setMediumErrorMessage] = useState('')

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const insertAdmin = async() => {

        if(login !== '' && password !== ''){
            if(login.length > 5){
                if(password.length > 8) {
                    const result = await Axios.post('http://localhost:3001/admin/register', { 
                        login: login,
                        password: password
                    });

                    if(result.data.success){
                        setSuccess(result.data.success);
                        setSuccessMessage(result.data.message)
                    }
                }else{
                    setErrorMessage('Mot de passe trop court')
                }
            }else{
                setErrorMessage('Login trop court')
            }
        }else{
            setErrorMessage('Veuillez remplir les champs.');
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
            
            <h1 className='main-title'> Ajout d'un administrateur </h1>

            <ul className='separator-list'>
                <li></li>
                <li></li>
                <li></li>
            </ul> 
            
            <Grid 
                container 
                direction="column" 
                xs={6}
                sx={{
                    margin: "0 auto"
                }}
            >
                <Grid item >
                    <FormControl sx={{width: "100%", marginBottom: "20px"}}>
                        <OutlinedInput 
                            placeholder='Login' 
                            onChange={(e) => {setLogin(e.target.value)}}
                            minLength={5}
                            maxLength={50}
                        /> 
                        <FormHelperText>  </FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item>
                    <TextField 
                        type="password" 
                        name="adminPassword" 
                        placeholder='Mot de passe'
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        maxLength={30}
                        sx={{width: "100%", marginBottom: "20px"}}
                    />                    
                </Grid>
                
                <Button 
                    variant="contained"
                    color="success"
                    onClick={insertAdmin}
                    sx={{
                        width: "50%",
                        margin: "0 auto"
                    }}
                >
                    Ajouter l'administrateur
                </Button>
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

export default AdminRegister;