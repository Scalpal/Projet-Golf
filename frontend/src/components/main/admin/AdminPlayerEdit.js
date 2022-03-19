import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Axios from 'axios';

function AdminPlayerEdit() {


    const { idJoueur } = useParams();
    const [player, setPlayer] = useState([]);

    const [newLastName, setNewLastName] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newAdress, setNewAdress] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newBirthdate, setNewBirthdate] = useState('');


    useEffect(async() => {
        const response = await Axios.post('http://localhost:3001/admin/player/edit', {
            idJoueur: idJoueur,
        });

        setPlayer(response.data[0]);
    }, [])

    console.log(player)
    
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

                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <label for="lastname"> Nom </label>
                            <input defaultValue={player.nom} id="lastname" onChange={(e) => {setNewLastName(e.target.value)}}/>
                        </Grid> 

                        <Grid item md={6}>
                            <label for="firstname"> Prénom </label>
                            <input defaultValue={player.prenom} id="firstname" onChange={(e) => {setNewFirstName(e.target.value)}}/>
                        </Grid>

                        <Grid item md={6}>
                            <label for="adresse"> Adresse </label>
                            <input defaultValue={player.adresse} id="adresse" onChange={(e) => {setNewAdress(e.target.value)}}/>
                        </Grid>

                        <Grid item md={6}>
                            <label for="telephone"> Téléphone </label>
                            <input defaultValue={player.telephone} id="telephone" onChange={(e) => {setNewPhone(e.target.value)}}/>
                        </Grid>

                        <Grid item md={6}>
                            <label for="adresse"> Date de naissance </label>
                            <input type="date" defaultValue={player.anniversaire} id="adresse" onChange={(e) => {setNewBirthdate(e.target.value)}}/>
                        </Grid>
                    </Grid>






                </Box>
            </Box>
        )
    }
}

export default AdminPlayerEdit