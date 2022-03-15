import React , { useState, useContext, useEffect }from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../Helper/LoginContext';
import Axios from 'axios';

function Login() {

    let navigate = useNavigate();

    //Contexts
    const { isLoggedIn,  setIsLoggedIn } = useContext(LoginContext);
    const [admin, setAdmin] = useState({});

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



    Axios.defaults.withCredentials = true ;

    const loginAdmin = async() => {
        const adminObject = await Axios.post('http://localhost:3001/admin/login', {
            login: login,
            password: password
        });

        if(adminObject.data.message){
            setErrorMessage(adminObject.data.message);
        }; 

        if(adminObject.data.idAdmin){
            const adminLogin = adminObject.data.login;

            setIsLoggedIn(true);
            setAdmin(adminObject.data);
            navigate('/admin/register');
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
        <div className='login'>
            <div className='inner-container'>

                {isLoggedIn ? (

                    <h1> Vous êtes connecté </h1>

                ) : (
                    <div className='login-page'>
                        <h1 className='main-login-title'> Connexion administrateur </h1>

                        {errorMessage ? (<h2> {errorMessage} </h2>) : null }

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
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login;