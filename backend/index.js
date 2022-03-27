const express = require('express');
const cors = require ('cors');
const app = express();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

var _ = require('lodash');

// Necessary
app.use(express.json());
app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
        key: "admin",
        secret: "pascalBeaugosse",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60*60*24*1000,
        },
    })
);

// Fonction pour créer la connexion avec la base de données
const getConnection = async () => {
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "projet-golf",
    });
    return db;
};

function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
  
    const dates = [];
  
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
  
    return dates;
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
        finalResult.tournaments = tournamentsResults[0];

        const playerResults = await db.query("SELECT * FROM joueur");
        finalResult.players = playerResults[0]
        
        for (let i = 0 ; i < tournamentsResults[0].length ; i++ ){
            const playerPointsResults = 
            await db.query(`SELECT IdJoueur, SUM(nbCoups) AS nombreCoups, SUM(nbPoints) AS nombrePoints FROM Jouer WHERE AnneeSaison = ${tournamentsResults[0][i].AnneeSaison} AND IdTournoi = ${tournamentsResults[0][i].IdTournoi} GROUP BY IdJoueur ORDER BY SUM(nbPoints) DESC`);

            // console.log(playerPointsResults)
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

        res.send(finalResult);
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
        const groupedHolesById = _.groupBy(holesData, 'idParcours');
        const sortedHolesArray = _.values(groupedHolesById);

        const sortedArray = await Promise.all(sortedHolesArray.map(async(holesArray) => {
            const sortedHolesByColor = _.groupBy(holesArray, 'genre');
            const finalArray = _.values(sortedHolesByColor)

            return finalArray;
        }));

        finalResult.holes = sortedArray;

        res.send(finalResult);
    }catch(err){
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})








// Admin
app.post("/admin/login", async(req,res) => {
    try {
        const db = await getConnection();

        const login = req.body.login;
        const password = req.body.password;
    
        const admin = await db.query('SELECT * FROM administrateur WHERE login= ?', login);
        const adminArray = admin[0];
        const adminObject = adminArray[0];
    
        if(adminArray.length > 0){
            bcrypt.compare(password, adminObject.password, async(error, result) => {
                if(result){
                    const adminInfo = await db.query('SELECT idAdmin, login FROM administrateur WHERE idAdmin = ? AND login = ?', [adminObject.idAdmin, adminObject.login]);
                    const adminInfosObject = adminInfo[0][0];

                    req.session.user = adminInfosObject;
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

app.get('/admin/login', (req,res) => {

    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});

app.post('/admin/logout', (req, res) => {
    console.log(req.cookies.admin);

    if(req.cookies.admin){
        res.clearCookie("admin");
        res.send({
            loggedState: false,
        });
    }else{
        res.send({
            loggedState: false,
        })
    }
})

app.post("/admin/register", async(req,res) => {
    const db = await getConnection();

    const login = req.body.login;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, async(err, hash) => {
        const insertQuery = "INSERT INTO administrateur (login,mdp) VALUES(?,?)";

        try {
            const result = await db.query(insertQuery, [login, hash]);
            res.send(result);

        } catch (error) {
            res.send({ message: "ERREUR"})
            console.log(error)
        }
    });
});

app.get("/admin/player/list", async(req,res) => {
    const db = await getConnection();

    try{
        const players = await db.query('SELECT * FROM joueur');

        res.send(players[0]);
    }catch(error){
        console.log(error);
    }
});

app.post("/admin/player/add", async(req, res) => {
    const db = await getConnection();

    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const playerAdress = req.body.playerAdress;
    const playerPhone = req.body.playerPhone;
    const playerBirthDate = req.body.playerBirthDate;

    const cutBirthDate = playerBirthDate.substr(0,10);

    console.log(lastName);
    console.log(firstName);
    console.log(playerAdress);
    console.log(playerPhone);
    console.log(cutBirthDate);

    try{
        const insertQuery = await db.query('INSERT INTO joueur (nom,prenom,adresse,telephone,anniversaire) VALUES (?,?,?,?,?)', [lastName,firstName, playerAdress, playerPhone, cutBirthDate]);

        res.send({message: "L'ajout du joueur s'est déroulé avec succès !"});
    }catch(error){
        console.log(error);
        res.send({message: "Problème dans l'ajout"});
    }
});

app.post("/admin/player/edit", async(req, res) => {
    const db = await getConnection();

    const idPlayer = req.body.idJoueur;

    try {
        const player = await db.query('SELECT * FROM joueur WHERE IdJoueur = ?', idPlayer);

        res.send(player[0]);
    } catch (error) {
        console.log(error)
    }
})

app.get("/admin/tournament/create", async(req, res) => {

    const db = await getConnection();

    const finalResult = {
        seasons: [],
        tournaments: []
    }

    const seasons = await db.query('SELECT * FROM Saison');
    finalResult.seasons = seasons[0];

    const tournaments = await db.query('SELECT DISTINCT nomTournoi from tournoi;');
    finalResult.tournaments = tournaments[0];

    res.send(finalResult);
})

app.post("/admin/tournament/create", async(req, res) => {

    const db = await getConnection();

    const tournamentName = req.body.tournamentName;
    const year = req.body.year;

    try {
        const tournaments = await db.query('SELECT * FROM tournoi WHERE nomTournoi = ?', tournamentName);
        const tournamentData = tournaments[0];

        // Récupération simple des infos du tournoi 
        const tournamentYear = tournamentData[0].AnneeSaison;
        const tournamentId = tournamentData[0].IdTournoi;
        const tournamentDateBegin = tournamentData[0].dateDebut;
        const tournamentDateEnd = tournamentData[0].dateFin;
        const tournamentIdCourse = tournamentData[0].IdParcours;
        const tournamentPlace = tournamentData[0].lieu;
        const tournamentDescription = tournamentData[0].description;

        // Création de la date de début et de fin du tournoi avec l'année choisie 
        const beginDateObject = new Date(tournamentDateBegin);
        const endDateObject = new Date(tournamentDateEnd);
        const newBeginDate = new Date(year, beginDateObject.getMonth(), beginDateObject.getDate());
        const newEndDate = new Date(year, endDateObject.getMonth(), endDateObject.getDate());
    
        const doTournamentExist = () => {
            let check = false;

            tournamentData.map((tournament) => {
                if(tournament.AnneeSaison === year){
                    check = true;
                    return check;
                }else{
                    check=check;
                }
            })
            return check;
        }

        const doExist = doTournamentExist();
        console.log(doExist);

        if (!doExist){
            const insertTournament = 
            await db.query("INSERT INTO tournoi (AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu, description) VALUES (?,?,?,?,?,?,?,?)", 
            [year, tournamentId, tournamentName, newBeginDate, newEndDate, tournamentIdCourse,tournamentPlace, tournamentDescription]);
    
            // Dates entre la date de début et de fin du tournoi
            const dates = getDatesInRange(newBeginDate, newEndDate);
    
            dates.map(async(date, index) => {
                const day = index+1;
                console.log('ajout dans date !')
    
                const insertDate = await db.query('INSERT INTO date (AnneeSaison, IdTournoi, Jour, date) VALUES (?, ?, ?, ?)', [year, tournamentId, day, date]);
            });

            res.send({message: "L'ajout du tournoi s'est déroulé avec succès !"});
        }else{
            res.send({message: "Le tournoi pour cette année existe déjà !", doExist: true});
        }
    } catch (error) {
        console.log(error);
    }
})



app.get("/admin/tournament/addScores", async(req,res) => {

    const db = await getConnection();

    const finalResult = {
        players: [],
        tournaments: [],
        holes: [],
        holeGenders: []
    }

    const players = await db.query("SELECT * FROM joueur;");
    finalResult.players = players[0];

    const tournaments = await db.query("SELECT * FROM tournoi ORDER BY IdTournoi ASC");
    const groupedTourn = _.groupBy(tournaments[0], 'nomTournoi');
    const sortedTournaments = _.values(groupedTourn);

    finalResult.tournaments = sortedTournaments;

    const holes = await db.query("SELECT * FROM trou");
    const holesData = holes[0]; 
    const groupedHoles = _.groupBy(holesData, 'IdParcours'); // groupage des trous par Parcours
    const sortedHolesArray = _.values(groupedHoles); // Transformation des groupes en tableaux de trous par parcours

    console.log(sortedHolesArray);

    // Trous triés par parcours 
    const sortedArray = await Promise.all(sortedHolesArray.map(async(holesArray) => {
        const sortedHolesByColor = _.groupBy(holesArray, 'genre'); // Groupage des trous qui sont triés par IdParcours, par genre désormais
        const finalArray = _.values(sortedHolesByColor)

        return finalArray;
    }));
    finalResult.holes = sortedArray;

    const holeColors = await db.query('SELECT DISTINCT genre FROM trou');
    finalResult.holeGenders = holeColors[0];

    console.log(players[0]);
    console.log(sortedTournaments);
    // console.log(holes);
    // console.log(players[0]);



    res.send(finalResult);
});

app.post('/admin/tournament/addScores', async(req,res) => {
    const db = await getConnection();

    // Données récupérée du front 
    const idTournament = req.body.idTournament;
    const yearTournament = req.body.yearTournament;
    const idPlayer = req.body.idPlayer;
    const holeColor = req.body.holeColor;
    const scores = req.body.score;  //Tableau des nombre de coups de chaque trous

    console.log(idTournament)
    console.log(yearTournament)
    console.log(idPlayer)
    console.log(holeColor)
    console.log(scores)

    const newScores= [];
    scores.map((score) => {
        const intScore = parseInt(score);
        newScores.push(intScore);
    })

    console.log(newScores);

    const tournament = await db.query('SELECT * FROM tournoi WHERE IdTournoi = ? AND AnneeSaison = ? ', [idTournament, yearTournament]);
    const tournamentData = tournament[0][0];
    const dateDebut = tournamentData.dateDebut;
    const dateFin = tournamentData.dateFin;
    const idParcours = tournamentData.IdParcours;


    const selectedHoles = await db.query("SELECT * FROM trou WHERE IdParcours = ? AND Couleur = ? ", [idParcours, holeColor]);

    try {
        const participate = await db.query("INSERT INTO participer (AnneeSaison, IdTournoi, IdJoueur) VALUES( ? , ? , ?)", [yearTournament, idTournament, idPlayer]);
        
        newScores.map(async(score,index) => {
            const par = selectedHoles[0][index].Par;
            const nbCoups = score;
            const idTrou = index + 1;
            const nbPoints = nbCoups - par;

           console.log(score);
           console.log(par);
           console.log("--")

            const insertScore = await db.query("INSERT INTO jouer (IdJoueur, AnneeSaison, IdTournoi, Jour, IdParcours, IdTrou, Couleur, nbCoups, nbPoints) VALUES (? , ? , ? , ? , ? , ? , ? , ?, ?)", 
            [idPlayer, yearTournament, idTournament, 1 ,idParcours, idTrou, holeColor, nbCoups, nbPoints ]);

        })

        res.send({message: "L'insertion s'est déroulée avec succès."});
    } catch (err) {
        console.log(err);

        res.send({message: "L'ajout ne s'est pas fait."});
    } 
    res.send({message: "L'insertion s'est déroulée avec succès."});
})




app.listen(3001, () => {
    console.log("running on port 3001");
});

console.log('ça fonctionne');