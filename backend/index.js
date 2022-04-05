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


app.use(session({
        key: "admin",
        secret: "pascalBeaugosse",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60*60*24*1000,
            secure: false,
        },
    })
);


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
            threeBestPlayers: [],
        }
        const db = await getConnection();
        
        // Récupération des tournois existants
        const tournamentsData = await db.query("SELECT AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu FROM `tournoi` ORDER BY idTournoi;");
        const tournaments = tournamentsData[0];
        finalResult.tournaments = tournaments;

        // Récupération des joueurs
        const playersData = await db.query("SELECT * FROM joueur");
        const players = playersData[0];
        finalResult.players = players;

        // Récupération des participations des joueurs 
        const tournamentsPlayedData = await db.query("SELECT * FROM participer");
        const tournamentsPlayed = tournamentsPlayedData[0];
        finalResult.tournamentsPlayed = tournamentsPlayed;

        const finalArray = await Promise.all(tournaments.map(async(tournament) => {
            // Récupération de TOUT les scores d'un tournoi
            const playersScoreForTournament = 
            await db.query(`SELECT IdJoueur, IdTournoi, AnneeSaison, sum(nbCoups) as nbCoups, sum(nbPoints) as nbPoints FROM Jouer WHERE AnneeSaison = ${tournament.AnneeSaison} AND IdTournoi = ${tournament.IdTournoi} GROUP by IdJoueur ORDER BY sum(nbPoints)`);

            return playersScoreForTournament[0];
        }))
        const flattenedArray = _.flatten(finalArray);
        const sortedArray = _.groupBy(flattenedArray, 'AnneeSaison');
        const playersScoreSortedByYear = _.values(sortedArray);

        function getInfosPlayer(idJoueur){
            const specificPlayer = [] 
        
            players.map((player) => {
                if(player.idJoueur === idJoueur){
                    specificPlayer.push(player)
                }
            })
            return specificPlayer;
        }

        const newPlayersScores = [];

        // Parcours de tout les scores pour y ajouter le genre sur l'objet récupéré contenant le score
        playersScoreSortedByYear.map((yearScores) => {
            yearScores.map((playerScore) => {
                const playerInfos = getInfosPlayer(playerScore.IdJoueur);
                const playerGenre = playerInfos[0].genre;

                newPlayersScores.push({...playerScore, genre: playerGenre});
            })
        })
        const groupedNewPlayerScoresByYear = _.groupBy(newPlayersScores,'AnneeSaison');
        const valuesNewPlayerScoresByYear = _.values(groupedNewPlayerScoresByYear);

        // Scores trié par année; et dans chaque année, par genre (2022 -> homme / femme, etc...)
        const finalPlayerScoresByGender = [];
        valuesNewPlayerScoresByYear.map((yearScores) => {

            const groupedYearScoresByGender = _.groupBy(yearScores, 'genre');
            const valuesYearScoresByGender = _.values(groupedYearScoresByGender);

            finalPlayerScoresByGender.push(valuesYearScoresByGender);
        })


        function getTournamentScoresByYearAndGenre(idTournoi, anneeSaison, playerGenre){
            const tournamentScores = [];
    
            finalPlayerScoresByGender.map((yearScores) => {

                // Parcours des scores par ANNÉE 
                yearScores.map((genderScores) => {

                    //Parcours des scores de l'année, par GENRE
                    genderScores.map((score) => {
                        if(score.IdTournoi === idTournoi && score.AnneeSaison === anneeSaison && score.genre === playerGenre){
                            tournamentScores.push(score)
                        }
                    })
                })
            })
            const tournamentScoresGroupedByYear = _.groupBy(tournamentScores, 'AnneeSaison');
            const finalArray = _.values(tournamentScoresGroupedByYear);
    
            return finalArray;
        }
    

        // Fonctions 
        function getInfosTournoiByIdYear(idTournoi,anneeSaison) {
            const specificTournament = [];
    
            tournaments.map((tournament) => {
                if( tournament.IdTournoi === idTournoi && tournament.AnneeSaison === anneeSaison ){
                    specificTournament.push(tournament)
                }
            })
            return specificTournament;
        }

        function getTournamentsPlayed(playerID) {

            const tournamentsPlayedByPlayer = []
    
            tournamentsPlayed.map((participation) => {
    
                if(participation.IdJoueur === playerID){
                    tournamentsPlayedByPlayer.push(participation)
                }
            })
    
            return tournamentsPlayedByPlayer;
        }
        
        function getTournamentsWon(idJoueur) {
    
            const tournamentsWon = [];
            const checkedTournaments = [];
    
            // parcours de tout les tournois joués
            tournaments.map((tournament) => {
                
                const playerInfos = getInfosPlayer(idJoueur);
                const scoresOfTournament = getTournamentScoresByYearAndGenre(tournament.IdTournoi, tournament.AnneeSaison, playerInfos[0].genre);
                const sameElt = _.find(checkedTournaments, {'AnneeSaison': tournament.AnneeSaison, 'IdTournoi': tournament.IdTournoi});
     
                if (typeof sameElt === 'undefined'){
    
                    // parcours des scores du tournoi par année (scores de 2022 puis scores de 2023,...)
                    scoresOfTournament.map((scores) => { 
    
                        const tournamentWinnerID = scores[0].IdJoueur;
                        const theTournament = getInfosTournoiByIdYear(scores[0].IdTournoi, scores[0].AnneeSaison);
                        
                        // Vérification si l'id en paramètre est celui du 1er du tournoi (celui d'index 0) 
                        if(tournamentWinnerID === idJoueur){
                            tournamentsWon.push(theTournament[0]);
                            checkedTournaments.push(tournament); 
    
                        }else{
                            checkedTournaments.push(tournament);
                        }
                    })
                }
            })
            return tournamentsWon;
        }
        ////

        const allPlayersAndWins = [];
        const threeBestPlayers = [];

        players.map((player) => {
            const tournamentsWon = getTournamentsWon(player.idJoueur);
            const tournamentsPlayed = getTournamentsPlayed(player.idJoueur);
            allPlayersAndWins.push({...player,wins: tournamentsWon.length, nbParticipations: tournamentsPlayed.length });
        })

        const orderedAllPlayersAndWins = _.orderBy(allPlayersAndWins, ['wins'], ['desc']);
        threeBestPlayers.push(orderedAllPlayersAndWins[0],orderedAllPlayersAndWins[1],orderedAllPlayersAndWins[2]);

        finalResult.threeBestPlayers = threeBestPlayers;

        res.send(finalResult);
    }
    catch (err) {
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})



app.get("/tournamentRanking/:gender", async (req, res) => {
    try {
        const finalResult = {
            tournaments: [],
            tournamentsInfo: [],
            tournamentsPlayed: [],
            players: [],
            playersPoints: [],
        }
        const db = await getConnection();

        const gender = req.params.gender;

        // Récupération des INFORMATIONS des tournois
        const tournamentsDistinct = await db.query("SELECT DISTINCT IdTournoi, nomTournoi, lieu FROM tournoi");
        finalResult.tournamentsInfo = tournamentsDistinct[0];

        // Récupération des tournois existants
        const tournaments = await db.query("SELECT AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu FROM `tournoi` ORDER BY idTournoi;");
        const tournamentsData = tournaments[0];
        finalResult.tournaments = tournaments[0];

        // Récupération des participations des joueurs 
        const tournamentsPlayed = await db.query("SELECT * FROM participer");
        finalResult.tournamentsPlayed = tournamentsPlayed[0];

        // Récupération des joueurs
        const players = await db.query("SELECT * FROM joueur");
        finalResult.players = players[0];


        const finalArray = await Promise.all(tournamentsData.map(async(tournament) => {

            // Récupération de TOUT les scores d'un tournoi
            const playersScoreForTournament = 
            await db.query(`SELECT IdJoueur, IdTrou, IdTournoi, AnneeSaison, nbCoups, nbPoints, genre, jour FROM Jouer WHERE AnneeSaison = ${tournament.AnneeSaison} AND IdTournoi = ${tournament.IdTournoi} AND genre = '${gender}' ORDER BY IdJoueur`);

            return playersScoreForTournament[0];
        }))

        const flattenedArray = _.flatten(finalArray);
        const sortedArray = _.groupBy(flattenedArray, 'AnneeSaison');
        const playersScoreSortedByYear = _.values(sortedArray)
        finalResult.playersPoints = playersScoreSortedByYear;

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

app.get("/players", async (req, res) => {
    try {
        const finalResult = {
            tournaments: [],
            tournamentsInfo: [],
            tournamentsPlayed: [],
            players: [],
            allTournamentsScores: [],
        }
        const db = await getConnection();

        // Récupération des INFORMATIONS des tournois
        const tournamentsDistinct = await db.query("SELECT DISTINCT IdTournoi, nomTournoi, lieu FROM tournoi");
        finalResult.tournamentsInfo = tournamentsDistinct[0];

        // Récupération des tournois existants
        const tournamentsData = await db.query("SELECT AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu FROM `tournoi` ORDER BY idTournoi;");
        const tournaments = tournamentsData[0];
        finalResult.tournaments = tournaments;

        // Récupération des participations des joueurs aux tournois
        const tournamentsPlayed = await db.query("SELECT * FROM participer");
        finalResult.tournamentsPlayed = tournamentsPlayed[0];

        // Récupération des joueurs
        const playersData = await db.query("SELECT * FROM joueur");
        const players = playersData[0];
        finalResult.players = players;


        const finalArray = await Promise.all(tournaments.map(async(tournament) => {

            // Récupération de TOUT les scores d'un tournoi
            const playersScoreForTournament = 
            await db.query(`SELECT IdJoueur, IdTournoi, AnneeSaison,  sum(nbCoups) as nbCoups, sum(nbPoints) as nbPoints FROM Jouer WHERE AnneeSaison = ${tournament.AnneeSaison} AND IdTournoi = ${tournament.IdTournoi} GROUP by IdJoueur ORDER BY sum(nbPoints)`);

            return playersScoreForTournament[0];
        }))
        const flattenedArray = _.flatten(finalArray);
        const sortedArray = _.groupBy(flattenedArray, 'AnneeSaison');
        const playersScoreSortedByYear = _.values(sortedArray);

        function getInfosPlayer(idJoueur){
            const specificPlayer = [] 
        
            players.map((player) => {
                if(player.idJoueur === idJoueur){
                    specificPlayer.push(player)
                }
            })
            return specificPlayer;
        }

        const newPlayersScores = [];

        // Parcours de tout les scores pour y ajouter le genre sur l'objet récupéré contenant le score
        playersScoreSortedByYear.map((yearScores) => {
            yearScores.map((playerScore) => {
                const playerInfos = getInfosPlayer(playerScore.IdJoueur);
                const playerGenre = playerInfos[0].genre;

                newPlayersScores.push({...playerScore, genre: playerGenre});
            })
        })
        const groupedNewPlayerScoresByYear = _.groupBy(newPlayersScores,'AnneeSaison');
        const valuesNewPlayerScoresByYear = _.values(groupedNewPlayerScoresByYear);

        
        // Scores trié par année; et dans chaque année, par genre (2022 -> homme / femme, etc...)
        const finalPlayerScoresByGender = [];
        valuesNewPlayerScoresByYear.map((yearScores) => {
            const groupedYearScoresByGender = _.groupBy(yearScores, 'genre');
            const valuesYearScoresByGender = _.values(groupedYearScoresByGender);

            finalPlayerScoresByGender.push(valuesYearScoresByGender);
        })

        finalResult.allTournamentsScores = finalPlayerScoresByGender;

        res.send(finalResult);
    }
    catch (err) {
        console.log("ON A UNE ERREUR")
        console.error(err)
    }
})








// Admin

app.get('/admin/login', (req,res) => {

    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});

app.post("/admin/login", async(req,res) => {
    try {
        const db = await getConnection();

        const login = req.body.login;
        const password = req.body.password;
    
        const admin = await db.query('SELECT * FROM administrateur WHERE login= ?', login);
        const adminArray = admin[0];
        const adminObject = adminArray[0];
    
        if(adminArray.length > 0){
            bcrypt.compare(password, adminObject.mdp, async(error, result) => {
                if(result){
                    const adminInfo = await db.query('SELECT id, login FROM administrateur WHERE id = ? AND login = ?', [adminObject.id, adminObject.login]);
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
});

app.post("/admin/register", async(req,res) => {
    const db = await getConnection();

    const login = req.body.login;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, async(err, hash) => {
        const insertQuery = "INSERT INTO administrateur (login,mdp) VALUES(?,?)";

        try {
            const result = await db.query(insertQuery, [login, hash]);
            res.send({message: "L'ajout de l'administrateur est un succès ! ", success: true});

        } catch (error) {
            res.send({ message: "Erreur dans l'ajout, veuillez réessayer.", error: true})
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

app.get("/admin/player/add", async(req,res) => {
    const db = await getConnection();

    try {
        const genders = await db.query("SELECT DISTINCT genre FROM trou");

        res.send(genders[0]);
    } catch (error) {
        console.log(error)
    }
});

app.post("/admin/player/add", async(req, res) => {
    const db = await getConnection();

    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const playerAdress = req.body.playerAdress;
    const playerPhone = req.body.playerPhone;
    const playerBirthDate = req.body.playerBirthDate;
    const genre = req.body.genre;

    const cutBirthDate = playerBirthDate.substr(0,10);

    // console.log(lastName);
    // console.log(firstName);
    // console.log(playerAdress);
    // console.log(playerPhone);
    // console.log(cutBirthDate);

    try{
        const insertQuery = await db.query('INSERT INTO joueur (nom,prenom,adresse,telephone,anniversaire,genre) VALUES (?,?,?,?,?,?)', [lastName,firstName, playerAdress, playerPhone, cutBirthDate,genre]);

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
});

app.post("/admin/player/edit/confirm", async(req,res) => {
    const db = await getConnection();

    const idPlayer = req.body.idJoueur;
    const newLastName = req.body.nom;
    const newFirstName = req.body.prenom;
    const newAdress = req.body.adresse;
    const newPhone = req.body.telephone;

    try {

        const updateQuery = await db.query('UPDATE joueur SET nom = ?, prenom = ?, adresse = ?, telephone = ? WHERE idJoueur = ?', [newLastName, newFirstName, newAdress, newPhone, idPlayer]);
        
        console.log(updateQuery);
        res.send({success: true, message: "La modification s'est déroulé avec succès !"});
    } catch (error) {
        console.log(error);
        res.send({error: true, message: "Problème dans l'ajout, veuillez réessayer."});
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

    const allSeasons = await db.query("SELECT * FROM Saison");
    const allSeasonsData = allSeasons[0];

    try {
        const tournaments = await db.query('SELECT * FROM tournoi WHERE nomTournoi = ?', tournamentName);
        const tournamentData = tournaments[0];


        // Récupération simple des infos du tournoi 
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

        const doYearExist = (year) => {
            let check =  false ;

            allSeasonsData.map((season) => {

                if(season.AnneeSaison === year){
                    check = true;
                    return check;
                }else{
                    check=check;
                }
            })
            return check;
        }

        const doTournamentExists = doTournamentExist();
        const doYearExists = doYearExist(year);

        console.log(doYearExists)

        if (!doTournamentExists){

            if(!doYearExists){
                const createSeason = await db.query("INSERT INTO Saison (AnneeSaison) VALUES ( ? )", year);
            }

            const insertTournament = 
            await db.query("INSERT INTO tournoi (AnneeSaison, IdTournoi, nomTournoi, dateDebut, dateFin, IdParcours, lieu, description) VALUES (?,?,?,?,?,?,?,?)", 
            [year, tournamentId, tournamentName, newBeginDate, newEndDate, tournamentIdCourse,tournamentPlace, tournamentDescription]);
    
            // Dates entre la date de début et de fin du tournoi
            const dates = getDatesInRange(newBeginDate, newEndDate);
    
            dates.map(async(date, index) => {
                const day = index+1;
    
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
        playingDates: [],
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

    const playingDates = await db.query("SELECT * FROM date");
    finalResult.playingDates = playingDates[0];

    res.send(finalResult);
});


app.post('/admin/tournament/addScores', async(req,res) => {
    const db = await getConnection();

    // Données récupérée du front 
    const idTournament = req.body.idTournament;
    const yearTournament = req.body.yearTournament;
    const idPlayer = req.body.idPlayer;
    const scores = req.body.score;  //Tableau d'objet contenant chaque idTrou/jour/score


    // Récupération des scores sur les tournoi du joueur pour vérifier si les scores pour le joueur sur le tournoi choisi
    // ne sont pas déjà ajoutés
    const playerAllScores = await db.query('SELECT * FROM Jouer WHERE IdJoueur = ?', idPlayer);
    const isTournamentAlreadyPlayed = _.find(playerAllScores[0],{IdJoueur: idPlayer, AnneeSaison: yearTournament, IdTournoi: idTournament});

    if(isTournamentAlreadyPlayed){
        res.send({message: "Les scores pour ce joueur ont déjà été ajoutés ! ", mediumError: true});

    }else{

        // Tableau des scores triés par jour
        const groupedScoresByDay = _.groupBy(scores, 'day');
        const flattenedScoresArray = _.values(groupedScoresByDay);

        // Récupération du genre du joueur
        const player = await db.query('SELECT * FROM joueur WHERE idJoueur = ?', idPlayer);
        const playerObject = player[0][0];
        const playerGenre = playerObject.genre;


        // Récupération du parcours du tournoi 
        const tournament = await db.query('SELECT * FROM tournoi WHERE IdTournoi = ? AND AnneeSaison = ? ', [idTournament, yearTournament]);
        const tournamentData = tournament[0][0];
        const idParcours = tournamentData.IdParcours;

        // Récupération des trous du tournoi qui correspondent au genre du joueur choisi
        const selectedHoles = await db.query("SELECT * FROM trou WHERE idParcours = ? AND genre = ? ", [idParcours, playerGenre]);
        const selectedHolesArray = selectedHoles[0];

        try {
            flattenedScoresArray.map((day) => {
                day.map(async(score) => {

                    // Récupération de l'id du trou, le jour ou il a été joué et du nombre de coups réalisés
                    const holeId = score.idTrou;
                    const scoreDay = parseInt(score.day);
                    const nbCoups = parseInt(score.score);
                
                    // Récupération du par du trou
                    const specificHole = _.find(selectedHolesArray, {'IdTrou': holeId});
                    const par = specificHole.Par;

                    // Calcul des points 
                    const nbPoints = nbCoups - par;

                    const insertScore = await db.query("INSERT INTO Jouer (IdJoueur, AnneeSaison, IdTournoi, Jour, idParcours, IdTrou, Genre, nbCoups, nbPoints) VALUES (? , ? , ? , ? , ? , ? , ? , ?, ?)", 
                    [idPlayer, yearTournament, idTournament, scoreDay ,idParcours, holeId, playerGenre, nbCoups, nbPoints ]);
                })
            })
            res.send({message: "L'ajout des scores est un succès !", success: true});

        } catch (error) {
            console.log(error);

            res.send({message: "Il y a eu un problème dans l'ajout.", error: true});
        }         
    }
})


app.listen(3001, () => {
    console.log("running on port 3001");
});

console.log('ça fonctionne');