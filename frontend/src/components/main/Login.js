import React , { useState, useContext }from 'react';
import { LoginContext } from '../Helper/LoginContext';
import Axios from 'axios';

function Login() {

    //Contexts
    const { isLoggedIn,  setIsLoggedIn } = useContext(LoginContext);
    const [admin, setAdmin] = useState({})

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    const loginAdmin = async() => {
        const adminObject = await Axios.post('http://localhost:3001/admin/login', {
            login: login,
            password: password
        });

        if(adminObject){
            setErrorMessage(adminObject.data.message)
        }

    }

    

    return (
        <div className='login'>
            <div className='inner-container'>

                <h1 className='main-login-title'> Connexion administrateur </h1>

                <label for="login"> Login </label>
                <input 
                    type="text" 
                    name="login"
                    onChange={(e) => setLogin(e.target.value)}
                />
                
                <label for="password"> Mot de passe </label>
                <input 
                    type="password" 
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" onClick={loginAdmin} > Connexion </button>
            
            <button onClick={() => setIsLoggedIn(true)} >  connexion</button>
            <button onClick={() => setIsLoggedIn(false)} >  deconnexion</button>

            </div>
        </div>
    )
}

export default Login;