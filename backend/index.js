const express = require('express')
const bodyParser = require('body-parser')
const cors = require ('cors')
const app = express()
const mysql = require('mysql2/promise')
var _ = require('lodash');

// Necessary
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));



const getConnection = async () => {
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "projet_golf",
    });
    return db;
}

app.get("/dashboard", async (req, res) => {
    try {
        const finalResult = {
            tournaments: [],
            players: [],
            playersPoints: [],
        }
        const db = await getConnection();

        const tournamentsResults = await db.query("SELECT  * FROM tournoi");
        finalResult.tournaments = tournamentsResults[0]

        const playerResults = await db.query("SELECT * FROM joueur");
        finalResult.players = playerResults[0]
        
        for (let i = 0 ; i < tournamentsResults[0].length ; i++ ){
            const playerPointsResults = 
            await db.query(`SELECT IdJoueur, SUM(nbCoups) AS nombreCoups, SUM(nbPoints) AS nombrePoints FROM Jouer WHERE AnneeSaison = ${tournamentsResults[0][i].AnneeSaison} AND IdTournoi = ${tournamentsResults[0][i].IdTournoi} GROUP BY IdJoueur ORDER BY SUM(nbPoints) DESC`);

            console.log(playerPointsResults)
            finalResult.playersPoints.push(playerPointsResults[0]) 
        } 

        res.send(finalResult)
    }
    catch (err) {
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})



app.get("/tournamentRanking", async (req, res) => {
    try {
        const finalResult = {
            tournaments: [],
            tournamentsInfo: [],
            players: [],
            playersPoints: [],
        }
        const db = await getConnection();

        const tournamentsDistinct = await db.query("SELECT DISTINCT idTournoi, nomTournoi, lieu FROM tournoi");
        finalResult.tournamentsInfo = tournamentsDistinct[0];

        const tournaments = await db.query("SELECT AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu FROM `tournoi` ORDER BY idTournoi;");
        finalResult.tournaments = tournaments[0];

        const players = await db.query("SELECT * FROM joueur");
        finalResult.players = players[0];

        const tournamentsData = tournaments[0];




        const finalArray = await Promise.all(tournamentsData.map(async(tournament) => {

            const playersScoreForTournament = 
            await db.query(`SELECT IdJoueur, IdTournoi, AnneeSaison, SUM(nbCoups) AS nombreCoups, SUM(nbPoints) AS nombrePoints FROM Jouer WHERE AnneeSaison = ${tournament.AnneeSaison} AND IdTournoi = ${tournament.IdTournoi} GROUP BY IdJoueur ORDER BY SUM(nbPoints) DESC`);

            return playersScoreForTournament[0];
        }))

        const flattenedArray = _.flatten(finalArray);
        const sortedArray = _.groupBy(flattenedArray, 'AnneeSaison');
        const playersScoreSorted = _.values(sortedArray)

        console.log(playersScoreSorted)

        finalResult.playersPoints = playersScoreSorted;

        console.log(finalResult.playersPoints)
        res.send(finalResult)
    }
    catch (err) {
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})






app.listen(3001, () => {
    console.log("running on port 3001");
})

console.log('ça fonctionne')