import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function AddAdmin() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const insertAdmin = () => {

        if(login !== '' && password !== ''){
            if(login.length > 5){
                if(password.length > 8) {
                    Axios.post('http://localhost:3001/admin/register', { 
                        login: login,
                        password: password
                    });
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
    <div className='addAdmin'>
        <div className='inner-container'>
            
            <h1> Ajouter un admin </h1>

            {errorMessage ? (<h2> {errorMessage} </h2>) : null }
            
            <label for="adminLogin"> Login du compte </label>
            <input 
                type="text" 
                name="adminLogin" 
                onChange={(e) => setLogin(e.target.value)} 
                minLength={5}
                maxLength={30}
                className="in"
            />

            <label for="adminPassword"> Mot de passe du compte</label>
            <input 
                type="password" 
                name="adminPassword" 
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={30}
                className=""
            />

            <button type="submit" onClick={insertAdmin} > Ajouter </button>
        </div>
    </div>
  )
}

export default AddAdmin;