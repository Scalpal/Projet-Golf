import { Link } from 'react-router-dom';

function Home(){

    return (
        <div className="home">
            <div className='home-content' >
                <h1>Bienvenue sur InfoGolf </h1>

                <h2> Ici vous trouverez toutes les informations concernant les tournois de golfs, les scores et les classements. </h2>

                <Link to="/dashboard" className='home-link'> Accéder au tableau de bord </Link>
            </div>
        </div>
    )
}

export default Home;