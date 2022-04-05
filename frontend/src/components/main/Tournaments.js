import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';

import backgroundMasters from '../assets/masters-golf.jpeg';


function Tournaments () {

    const [ tournaments, setTournaments ] = useState([]);
    const [ courses, setCourses ] = useState([]);
    const [ holes, setHoles ] = useState([])

    useEffect(async ()=> {
        document.title = "InfoGolf - Les tournois ";

        const datas = await Axios.get('http://localhost:3001/tournaments');

        setTournaments(datas.data.tournaments);
        setCourses(datas.data.courses);
        setHoles(datas.data.holes);

    }, [])

    // console.log(holes)


    function orderByGender(holeArray) {
        const arrayOrderedByGender = [];

        if(holeArray){
            arrayOrderedByGender.push(holeArray[1]);
            arrayOrderedByGender.push(holeArray[0]);
        }

        return arrayOrderedByGender;
    }

    // const listepopo = ['caca', "pipi", "popo", "squid"];
    // listepopo.splice(0, 0, listepopo[3])
    // console.log(listepopo)


    // console.log(courses)
    // console.log(tournaments)
    // console.log(holes[0])


    return (

        <div className='tournaments'>
            <div className='inner-container' >
                <h1 className='main-title'> Les tournois </h1>

                <ul className='separator-list'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

                {tournaments.map((tournament) => {

                    //Parcours du tournoi 
                    const tournamentCourseArray = _.filter(courses, {'idParcours': tournament.IdParcours});
                    const tournamentCourse = tournamentCourseArray[0];

                    const courseHoles = [];

                    holes.map((courseHolesArray) => {
                        if(courseHolesArray[0][0].idParcours.includes(tournament.IdParcours)){
                            courseHoles.push(courseHolesArray)
                        }
                    })

                    //Trous du parcours triés par genre 
                    const courseHolesContent = courseHoles[0];
                    const holesSortedByGender = orderByGender(courseHolesContent);

                    console.log(holesSortedByGender);


                    return (
                        <div className="tournament-card" key={tournament.idTournoi}>
                            
                            <h2 className='tournament-card-name' > {tournament.nomTournoi} </h2>

                            {/* <h3> {tournamentCourse?.NomParcours} </h3>  */}

                            <details>
                                <summary> </summary>

                                <p className='tournament-description'> {tournament.description} </p>

                                <h3> {tournamentCourse?.NomParcours} </h3>

                                <p className='course-description'> {tournamentCourse?.description} </p>

                                <table>
                                    <thead>
                                        <th> Genre </th>
                                        <th> 1 </th>
                                        <th> 2 </th>
                                        <th> 3 </th>
                                        <th> 4 </th>
                                        <th> 5 </th>
                                        <th> 6 </th>
                                        <th> 7 </th>
                                        <th> 8 </th>
                                        <th> 9 </th>
                                    </thead>

                                    <tbody>
                                        {holesSortedByGender?.map((gender) => {
                                            const hole = gender[0];

                                            return(
                                                <React.Fragment>
                                                    <tr>
                                                        <td> {hole.genre} </td>

                                                        {gender.map((holes) => {
                                                            return (
                                                                <React.Fragment>
                                                                    <td> 
                                                                        {holes.distanceMetre}m <br/>
                                                                        {holes.distanceYard}y
                                                                    </td>
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </tr> 
                                                    <tr>
                                                        <td colSpan={1}> Par </td>
                                                        {gender.map((holes) =>{
                                                            return (
                                                                <td> {holes.Par} </td>
                                                            )
                                                        })}
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </details>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Tournaments;