import React, { useState, useEffect } from 'react';
import Axios from 'axios';


function AddImage() {

    const [images, setImages] = useState([]);
    const [players, setPlayers] = useState([]);

    const [playerSelected, setPlayerSelected] = useState(0);
    const [ isMainImage, setIsMainImage ] = useState(false);


    const [ message, setMessage ] = useState('');

    useEffect(async() => {

        const result = await Axios.get("http://localhost:3001/addImage");

        setPlayers(result.data)

    }, [Axios, setPlayers])

    function onImageChange(e) {
        setImages([...e.target.files]);
    }

    async function sendImages () {
        const result = await Axios.post("http://localhost:3001/addImage", {
            idJoueur: playerSelected,
            images: images[0].name,
            isMainImage: isMainImage,
        });

        setMessage(result.data.message);
    }

    console.log("--");
    console.log(playerSelected);
    console.log(isMainImage);

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "100px" }}>

        <select
            onChange={(e) => {setPlayerSelected(e.target.value)}}
        >
            {players.map((player) => {
                return(
                    <option
                        value={player.idJoueur}
                    >
                        {player.idJoueur}
                    </option>
                )
            })}
        </select> 
        <input type="file" accept="image/*" onChange={(e) => {onImageChange(e)}} />

        <button
            onClick={() => {setIsMainImage(true)}}
        >
            Vrai
        </button>
        <button
            onClick={() => {setIsMainImage(false)}}
        >
            Faux
        </button>

        <button 
            onClick={sendImages}
        >
            Envoyer les images 
        </button>

        <h2> {message} </h2>
    </div>


  )
}

export default AddImage