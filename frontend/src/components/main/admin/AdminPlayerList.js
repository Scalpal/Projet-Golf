import React, { useState, useEffect }from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';

export default function PlayerTable() {

    const [players, setPlayers] = useState([]);

    useEffect(async() => {
        const datas = await Axios.get('http://localhost:3001/admin/player/list');

        // Données des joueurs mieux affichée 
        const playersInfoCleaned = (arrayPlayers) => {
            const playersInfo = [];

            arrayPlayers.map((player) => {
                const playerObject = {};
                
                playerObject.IdJoueur = player.IdJoueur;
                playerObject.nom = player.nom;
                playerObject.prenom = player.prenom;
                playerObject.adresse = player.adresse;
                playerObject.telephone = formatFrenchPhoneNumber(player.telephone);
                playerObject.anniversaire = player.anniversaire.substr(0,10);
    
                playersInfo.push(playerObject);
            });

            return playersInfo;
        }

        setPlayers(playersInfoCleaned(datas.data));

    }, [])

    // Fonction pour mettre le numéro de tél au format FR 
    function formatFrenchPhoneNumber(number) {
        return number.split('').join(' ').replace(/([0-9]) ([0-9])\b/g, '$1$2');
    }
    
    const columns = [
        {field: 'IdJoueur', headerName: 'Id', flex: 0.5},
        {field: 'nom', headerName: 'Nom', flex: 0.8},
        {field: 'prenom', headerName: 'Prénom', flex: 0.8},
        {field: 'adresse', headerName: 'Adresse', flex: 1.2 , sortable: false},
        {field: 'telephone', headerName: 'Téléphone', flex: 0.8},
        {field: 'anniversaire', headerName: 'Date de naissance', flex: 0.8},
        {field: "Modification", headerName: "", flex: 0.6, sortable: false, 
            renderCell: (params) => {
                const idJoueur = params.row.IdJoueur;
                return (
                    <Link 
                        className='edit-link'
                        style={{
                            borderRadius: "10px",
                            backgroundColor: "rgb(48,48,48)",
                            padding: "5px 8px",
                            color: "white",
                            textDecoration: "none",
                            margin: "0 auto"
                        }}
                        to={`/admin/player/${idJoueur}/edit`}
                    > 
                        Modifier 
                    </Link>
                )
            }
        },
    ];

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
                <h1 className='main-title'> Liste des joueurs </h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                <DataGrid 
                    rows={players}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row.IdJoueur}
                    sx={{
                        backgroundColor: "rgb(168,168,168)",
                        color: "white",
                        fontFamily: 'Poppins, sans-serif'
                    }}
                />
            </Box>

        </Box>
    )
}
