import React , { useState, useContext, useEffect }from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../Helper/LoginContext';
import Axios from 'axios';
import { Box } from '@mui/material';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function Login() {

    let navigate = useNavigate();

    //Contexts
    const { isLoggedIn,  setIsLoggedIn } = useContext(LoginContext);
    const [admin, setAdmin] = useState({});

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    Axios.defaults.withCredentials = true;

    const loginAdmin = async() => {
        const adminObject = await Axios.post('http://localhost:3001/admin/login', {
            login: login,
            password: password
        });

        if(typeof adminObject.data.message !== 'undefined' ){
            setErrorMessage(adminObject.data.message);
        }; 

        if(typeof adminObject.data.id !== 'undefined'){
            const adminLogin = adminObject.data.login;

            setIsLoggedIn(true);
            setAdmin(adminObject.data);
            navigate('/admin/player/list');

        }
    };

    useEffect(async() => {
        const session = await Axios.get("http://localhost:3001/admin/login");
        
        if(session.data.loggedIn){
            setIsLoggedIn(session.data.loggedIn);
        }

        if(session.data.user){
            setAdmin(session.data.user)
        }
    },[])




    return (
        <Box className='login'>
            <Box className='inner-container'>

                {isLoggedIn === true ? (
                    <h1> Vous êtes connecté </h1>
                ) : (
                    <Box className='login-page'>
                        <h1 className='main-title'> Connexion administrateur </h1>

                        <ul className='separator-list'>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul> 
                        {errorMessage ? (<h2> {errorMessage} </h2>) : null }

                        <Box
                            className='login-page-form'
                        >

                            <FormControl sx={{width: "100%"}}>
                                <OutlinedInput 
                                    placeholder='Login' 
                                    onChange={(e) => setLogin(e.target.value)}
                                    sx={{
                                    marginBottom: "20px",
                                    }}
                                /> 
                            </FormControl>
                            
                            <TextField 
                                type="password" 
                                name="adminPassword" 
                                placeholder='Mot de passe'
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                maxLength={30}
                                sx={{width: "100%", marginBottom: "20px"}}
                            />  

                            <Button 
                                variant="contained"
                                color="success"
                                onClick={loginAdmin}
                                sx={{
                                    width: "30%",
                                    margin: "0 auto",
                                }}
                            >
                                Connexion
                            </Button>

                            {/* <button type="submit" onClick={loginAdmin} > Connexion </button> */}

                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Login;