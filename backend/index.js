const express = require('express')
const bodyParser = require('body-parser')
const cors = require ('cors')
const app = express()
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const saltRounds = 10;

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
            tournamentsPlayed: [],
            players: [],
            playersPoints: [],
        }
        const db = await getConnection();

        const tournamentsDistinct = await db.query("SELECT DISTINCT idTournoi, nomTournoi, lieu FROM tournoi");
        finalResult.tournamentsInfo = tournamentsDistinct[0];

        const tournaments = await db.query("SELECT AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu FROM `tournoi` ORDER BY idTournoi;");
        finalResult.tournaments = tournaments[0];

        const tournamentsPlayed = await db.query("SELECT * FROM participer");
        finalResult.tournamentsPlayed = tournamentsPlayed[0];

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

        finalResult.playersPoints = playersScoreSorted;

        res.send(finalResult)
    }
    catch (err) {
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})


app.get("/tournaments", async(req, res) => {
    try{
        const finalResult = {
            tournaments: [],
            courses: [],
            holes: [],
        } 

        const db = await getConnection();

        const tournaments = await db.query("SELECT DISTINCT idTournoi, nomTournoi,IdParcours, lieu, description FROM tournoi");
        finalResult.tournaments = tournaments[0];

        const courses = await db.query("SELECT * FROM parcours");
        finalResult.courses = courses[0];

        const holes = await db.query("SELECT * FROM trou");
        const holesData = holes[0];
        const groupedHoles = _.groupBy(holesData, 'IdParcours');
        const sortedHolesArray = _.values(groupedHoles);

        const sortedArray = await Promise.all(sortedHolesArray.map(async(holesArray) => {
            const sortedHolesByColor = _.groupBy(holesArray, 'Couleur');
            const finalArray = _.values(sortedHolesByColor)

            return finalArray;
        }))

        finalResult.holes = sortedArray;

        res.send(finalResult)
    }catch(err){
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})

// Connexion admin
app.post("/admin/login", async(req,res) => {
    try {
        const db = await getConnection();

        const login = req.body.login;
        const password = req.body.password;

        console.log(login);
        console.log(password);
    
        const admin = await db.query('SELECT * FROM admin WHERE login= ?', login);
        const adminArray = admin[0];
        const adminObject = adminArray[0];
    
        if(adminArray.length > 0){
            bcrypt.compare(password, adminObject.password, async(error, result) => {

                if(result){
                    const adminInfo = await db.query('SELECT idAdmin, login FROM admin WHERE idAdmin = ? AND login = ?', [adminObject.idAdmin, adminObject.login]);
                    const adminInfosObject = adminInfo[0][0];
                    res.send(adminInfosObject);
                    
                }else{
                    res.send({message: "Mauvais login ou mot de passe"});
                }
            })
        }else{
            res.send({message: "Mauvais login ou mot de passe"});
        }
    }catch(error) {
        console.log("ON A UNE ERREUR");
        res.send({message: "Il y a une erreur de connexion "});
    }
});


app.post("/admin/register", async(req,res) => {

    const db = await getConnection();

    const login = req.body.login;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, async(err, hash) => {
        const insertQuery = "INSERT INTO admin (login,password) VALUES(?,?)";

        try {
            const result = await db.query(insertQuery, [login, hash]);
            res.send(result);

        } catch (error) {
            res.send({ message: "ERREUR"})
        }
    })
})


// app.put("/admin/players/add", async(req, res) => {
//     try {
        


//     } catch (err) {
//         console.log(err)
//     }
// })







app.listen(3001, () => {
    console.log("running on port 3001");
})

console.log('ça fonctionne')