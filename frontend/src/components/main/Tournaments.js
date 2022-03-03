import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import _ from 'lodash';


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


    function orderByColors(holeArray) {
        const arrayOrderedByColors = [];

        if(holeArray){
            arrayOrderedByColors.push(holeArray[3]);
            arrayOrderedByColors.push(holeArray[0]);
            arrayOrderedByColors.push(holeArray[2]);
            arrayOrderedByColors.push(holeArray[1]);
            arrayOrderedByColors.push(holeArray[4]);
        }

        return arrayOrderedByColors;
    }

    // const listepopo = ['caca', "pipi", "popo", "squid"];
    // listepopo.splice(0, 0, listepopo[3])
    // console.log(listepopo)


    // console.log(courses)
    // console.log(tournaments)
    // console.log(holes[0])

    return (

        <div className='tournaments'>
            <h1> je suis sur la page tournament</h1>

            {tournaments.map((tournament) => {

                //Parcours du tournoi 
                const tournamentCourseArray = _.filter(courses, {'IdParcours': tournament.IdParcours});
                const tournamentCourse = tournamentCourseArray[0];

                const courseHoles = [];

                holes.map((courseHolesArray) => {
                    if(courseHolesArray[0][0].IdParcours.includes(tournament.IdParcours)){
                        courseHoles.push(courseHolesArray)
                    }
                })

                //Trous du parcours triés par couleur 
                const courseHolesContent = courseHoles[0];
                const holesSortedByColor = orderByColors(courseHolesContent);

                return (
                    <div key={tournament.idTournoi}>
                        <h2> {tournament.nomTournoi} </h2>

                        <p> {tournament.description} </p>

                        <h3> {tournamentCourse?.NomParcours} </h3> 
                        <p> {tournamentCourse?.description} </p>

                        <details>
                            <summary> Voir les informations du parcours </summary>

                            <table>
                                <thead>
                                    <th> Couleur </th>
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
                                    {holesSortedByColor?.map((color) => {
                                        const hole = color[0];

                                        console.log("trou de couleur :")
                                        console.log(color);

                                        return(
                                            <React.Fragment>
                                                <tr>
                                                    <td> {hole.Couleur} </td>
                                                    <td> {hole.genre} </td>

                                                    {color.map((holes) => {
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
                                                    <td colSpan={2}> Par </td>
                                                    {color.map((holes) =>{
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

    )
};

export default Tournaments;