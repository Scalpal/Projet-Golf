import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo3.png';
import { LoginContext } from '../Helper/LoginContext';

function Navbar() {

    const { isLoggedIn } = useContext(LoginContext);

    return (
        <nav> 
            <div>
                <div>
                    <img src={logo} width="100" height="auto" />
                    <h2>InfoGolf</h2>
                </div>

                {isLoggedIn === false ? (

                    <React.Fragment>
                        <Link to="/dashboard"> Tableau de bord </Link>

                        <p>Classements</p>
                        <Link to="/playerRanking"> Classements des joueurs </Link>
                        <Link to="/tournamentRanking"> Classements des tournois </Link>


                        <p>Informations</p>
                        <Link to="/playerStats"> Les joueurs </Link>
                        <Link to="/tournaments"><i class='bx bx-bar-chart'></i> Les tournois </Link>
                    </React.Fragment>

                ) : (

                    <React.Fragment>
                        <p> Gestion des joueurs </p>
                        <Link to="/admin/players/list"> Liste des joueurs </Link>
                        <Link to="/admin/players/add"> Ajouter un joueur </Link>

                        <p> Gestion des tournois </p>
                        <Link to="/admin/tournament/create"> Création d'un tournoi </Link>
                        <Link to="/admin/tournament/score"> Ajouter des scores sur un tournoi </Link>

                        <p> Gestion des administrateurs </p>
                        <Link to="/admin/addAdmin"> Ajouter un compte administrateur </Link>
                    </React.Fragment>

                )}
            </div>

            <div>
                <Link to="/admin/login"> Connexion administrateur </Link>
            </div>
        </nav>
        
    )
};

export default Navbar;