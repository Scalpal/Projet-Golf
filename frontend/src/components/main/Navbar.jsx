import React, { useContext , useEffect} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import logo from '../assets/logoGolf.png';
import { LoginContext } from '../Helper/LoginContext';
import Axios from 'axios';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { Icon } from '@iconify/react';

function Navbar() {

    const { isLoggedIn , setIsLoggedIn } = useContext(LoginContext);

    const navigate = useNavigate();

    const logout = async() => {
        const logState = await Axios.post('http://localhost:3001/admin/logout');

        setIsLoggedIn(logState.data.loggedState);
        navigate('/dashboard');
    }

    Axios.defaults.withCredentials = true;

    useEffect(async() => {
        const response = await Axios.get('http://localhost:3001/admin/login');

        console.log(response.data);
        if(response.data.loggedIn === true){
            setIsLoggedIn(response.data.loggedIn)
        }
    }, [])
    

    return (
        <nav> 
            <Box>
                <Grid container md={12}>
                    
                    <Grid container item md={12} 
                        display="flex" 
                        direction="column" 
                        justifyContent="flex-start" 
                        alignItems="center"
                        sx={{
                            height: "fit-content"
                        }}
                    >
                        <img src={logo} width="100" height="auto" />
                        <h2>InfoGolf</h2>
                    </Grid> 

                    {isLoggedIn === true ? (
                        <Grid item 
                            display="flex" 
                            direction="column" 
                            justifyContent="flex-start"
                            sx={{
                                overflow: "auto"
                            }}
                        >
                            <Grid item md={12} display="flex" direction="column">
                                <p> Gestion des joueurs </p>
                                <Link to="/admin/player/list" className='icons-text'> Liste des joueurs </Link>
                                <Link to="/admin/player/add" className='icons-text'> Ajouter un joueur </Link>
                            </Grid>
            

                            <Grid item md={12} display="flex" direction="column" > 
                                <p> Gestion des tournois </p>
                                <Link to="/admin/tournament/create" className='icons-text'> Création d'un tournoi </Link>
                                <Link to="/admin/tournament/addScores" className='icons-text'> Ajouter des scores sur un tournoi </Link>
                            </Grid>

                            <Grid item md={12} display="flex" direction="column" >
                                <p> Gestion des administrateurs </p>
                                <Link to="/admin/register" className='icons-text'> Ajouter un compte administrateur </Link>
                            </Grid>

                        </Grid>
                    ) : (
                        // <Grid item display="flex" direction="column" justifyContent="flex-start">

                            <Grid item md={12} display="flex" direction="column">
                                <Link to="/dashboard" className='icons-text'> <i class='bx bxs-bar-chart-alt-2'></i> Tableau de bord </Link>

                                <Link to="/tournamentRanking/Homme" className='icons-text'> <Icon icon="bx:male" width="25" height="25"/> Classements Homme </Link>
                                <Link to="/tournamentRanking/Femme" className='icons-text'> <Icon icon="bx:female" width="25" height="25"/> Classements Femme </Link>

                                <Link to="/playerStats" className='icons-text'> <i class='bx bxs-face'></i> Joueurs </Link>
                                <Link to="/tournaments" className='icons-text'> <i class='bx bxs-trophy' ></i> Tournois </Link>
                            </Grid>

                        // </Grid>
                    )}
                </Grid>
            </Box>

            <div>
                {isLoggedIn === true ? (
                    <button 
                        className='logout-button'
                        onClick={logout}
                    > 
                        Se déconnecter 
                    </button>
                ) : (
                    <Link to="/admin/login"> Connexion administrateur </Link>
                )}
            </div>
        </nav>
        
    )
};

export default Navbar;