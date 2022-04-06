-- Les parcours

-- INSERT INTO `parcours` (`IdParcours`, `NomParcours`, `description`) VALUES
-- ('HC', 'Hankley Common', 'Si la plupart des golfs du Surrey sont logés non loin de hameaux et villages pittoresques, le golf d\'Hankley Common fait partie des exceptions. Il siège, en effet, au milieu de 340 hectares. En pleine nature, au calme, l\'espace est entouré de bruyères sauvages.'),
-- ('HLS', 'Hillside', 'Non loin de Liverpool, ce magnifique parcours de golf traverse les dunes de sable qui rendent le paysage côtier de Southport tellement impressionnant. Des rangées de pins gigantesques bordent la plupart des trous et font vraiment sortir Hillside du lot ! Croyez-nous, une compétition de golf ou un parcours entre amis restera longtemps gravé dans votre mémoire.'),
-- ('ND', 'Nefyn & District ', 'Le Pays de Galles n\'a rien à envier à l\'Ecosse quand il s\'agit d\'offrir des parcours de golf dignes d\'histoires fantastiques ; les paysages dans lesquels ils sont logés sont époustouflants. Et le golf de Nefyn & District fait partie des golfs que vous aurez envie d\'ajouter à votre liste déjà bien remplie. Le trou placé sur le promontoire de la péninsule de Lleyn dans la mer d\'Irlande ainsi que les trous 12 et 13 valent la visite à eux seuls.'),
-- ('RAD', 'Royal Aberdeen', 'Même si ce golf se trouve à plus de 10h de route du terminal Eurotunnel Le Shuttle, il est idéal si vous souhaitez partir à la conquête des meilleurs parcours britanniques lors d\'un circuit spécial ! Choisi en 2011 pour accueillir la Walker Cup, les golfeurs conseillent le Royal Aberdeen pour sa difficulté face aux éléments, un défi que vous serez heureux d\'avoir relevé.'),
-- ('RSD', 'Royal St. Davids', 'Classé parmi les parcours de golf les plus difficiles, le golf de Royal St Davids est lui aussi un vrai bonheur pour les yeux. En bord de mer, il offre des vues magnifiques sur la baie d\'Harlech et un parcours qui convient aux golfeurs de tous niveaux. D\'ailleurs, le golf accueille souvent des compétitions internationales pour golfeurs amateurs ou professionnels.'),
-- ('SND', 'Sunningdale', 'Tous les golfeurs sont unanimes, le golf de Sunningdale est LE golf à faire si vous venez jouer en Grande-Bretagne. A moins de 2h en voiture du terminal d\'Eurotunnel Le Shuttle, vous pouvez même vous y rendre pour la journée ! Le parcours le plus ancien – dit \"Old Course\" - date de 1901 et est un parcours classique qui traverse un parc verdoyant et boisé. Chaque trou a été savamment placé dans les parties boisées du domaine, un vrai régal !'),
-- ('STW', 'Saunton West', 'De nombreux golfeurs sont d\'accord sur un point capital : le parcours de Saunton se trouve parmi les meilleurs parcours britanniques. En plein cœur des dunes du Devon, traversé par des torrents, le golf ouest de Saunton offre un 18 trous époustouflant. Le parcours fait également partie des meilleurs \"greens\" du royaume.'),
-- ('TVS', 'Trevose', 'Etant donné les nombreux golfs qui parsèment les côtes de Cornouailles, le golf de Trevose est plutôt méconnu des golfeurs britanniques ; et c\'est tant mieux pour vous ! Les amateurs du sport ne seront pas déçus, le golf de Trevose propose un parcours incroyable, en bord de mer, où les golfeurs devront braver les éléments. Le panorama dans lequel le golf est placé est à couper le souffle !'),
-- ('WHS', 'Woodhall Spa', 'Avec deux parcours de championnat fantastiques – dont l\'un est classé dans les vingt premiers meilleurs parcours du monde – le golf de Woodhall Spa est le domicile de l\'union anglaise de golf ! L\'endroit est idéal pour passer un week-end golf comme on les aime. D\'anciennes forêts en chemins sablonneux bordés de bruyères, ces parcours de golf sont idéaux pour relever le défi d\'une partie épique dans un parcours anglais classique.');


-- Les trous 

idParcours, idTrou, genre, Par, distanceMetre, distanceYard

-- Parcours Hankley Common 

INSERT INTO trou VALUES ("HC", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("HC", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("HC", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("HC", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("HC", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("HC", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("HC", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("HC", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("HC", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("HC", 1, "Femme", 5, 420, 460);
INSERT INTO trou VALUES ("HC", 2, "Femme", 3, 290, 320);
INSERT INTO trou VALUES ("HC", 3, "Femme", 4, 360, 400);
INSERT INTO trou VALUES ("HC", 4, "Femme", 4, 200, 220);
INSERT INTO trou VALUES ("HC", 5, "Femme", 5, 320, 350);
INSERT INTO trou VALUES ("HC", 6, "Femme", 4, 260, 290);
INSERT INTO trou VALUES ("HC", 7, "Femme", 4, 120, 140);
INSERT INTO trou VALUES ("HC", 8, "Femme", 3, 400, 440);
INSERT INTO trou VALUES ("HC", 9, "Femme", 4, 420, 470);

-- Parcours Hillside 

INSERT INTO trou VALUES ("HLS", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("HLS", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("HLS", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("HLS", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("HLS", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("HLS", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("HLS", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("HLS", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("HLS", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("HLS", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("HLS", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("HLS", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("HLS", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("HLS", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("HLS", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("HLS", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("HLS", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("HLS", 9, "Femme", 4, 440, 490);

-- Parcours Nefyn & District 

INSERT INTO trou VALUES ("ND", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("ND", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("ND", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("ND", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("ND", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("ND", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("ND", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("ND", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("ND", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("ND", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("ND", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("ND", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("ND", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("ND", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("ND", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("ND", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("ND", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("ND", 9, "Femme", 4, 440, 490);

-- Parcours Royal Aberdeen 

INSERT INTO trou VALUES ("RAD", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("RAD", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("RAD", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("RAD", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("RAD", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("RAD", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("RAD", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("RAD", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("RAD", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("RAD", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("RAD", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("RAD", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("RAD", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("RAD", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("RAD", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("RAD", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("RAD", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("RAD", 9, "Femme", 4, 440, 490);

-- Parcours Royal Aberdeen 

INSERT INTO trou VALUES ("RSD", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("RSD", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("RSD", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("RSD", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("RSD", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("RSD", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("RSD", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("RSD", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("RSD", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("RSD", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("RSD", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("RSD", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("RSD", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("RSD", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("RSD", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("RSD", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("RSD", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("RSD", 9, "Femme", 4, 440, 490);

-- Parcours Sunningdale 

INSERT INTO trou VALUES ("SND", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("SND", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("SND", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("SND", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("SND", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("SND", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("SND", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("SND", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("SND", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("SND", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("SND", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("SND", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("SND", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("SND", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("SND", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("SND", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("SND", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("SND", 9, "Femme", 4, 440, 490);

-- Parcours Saunton West 

INSERT INTO trou VALUES ("STW", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("STW", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("STW", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("STW", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("STW", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("STW", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("STW", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("STW", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("STW", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("STW", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("STW", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("STW", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("STW", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("STW", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("STW", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("STW", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("STW", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("STW", 9, "Femme", 4, 440, 490);

-- Parcours Trevose 

INSERT INTO trou VALUES ("TVS", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("TVS", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("TVS", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("TVS", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("TVS", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("TVS", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("TVS", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("TVS", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("TVS", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("TVS", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("TVS", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("TVS", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("TVS", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("TVS", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("TVS", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("TVS", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("TVS", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("TVS", 9, "Femme", 4, 440, 490);

-- Parcours Woodhall Spa 

INSERT INTO trou VALUES ("WHS", 1, "Homme", 5, 500, 550);
INSERT INTO trou VALUES ("WHS", 2, "Homme", 3, 370, 400);
INSERT INTO trou VALUES ("WHS", 3, "Homme", 4, 440, 480);
INSERT INTO trou VALUES ("WHS", 4, "Homme", 4, 280, 302);
INSERT INTO trou VALUES ("WHS", 5, "Homme", 5, 400, 440);
INSERT INTO trou VALUES ("WHS", 6, "Homme", 4, 340, 370);
INSERT INTO trou VALUES ("WHS", 7, "Homme", 4, 200, 220);
INSERT INTO trou VALUES ("WHS", 8, "Homme", 3, 480, 520);
INSERT INTO trou VALUES ("WHS", 9, "Homme", 4, 500, 550);

INSERT INTO trou VALUES ("WHS", 1, "Femme", 5, 440, 480);
INSERT INTO trou VALUES ("WHS", 2, "Femme", 3, 310, 340);
INSERT INTO trou VALUES ("WHS", 3, "Femme", 4, 380, 420);
INSERT INTO trou VALUES ("WHS", 4, "Femme", 4, 220, 240);
INSERT INTO trou VALUES ("WHS", 5, "Femme", 5, 340, 370);
INSERT INTO trou VALUES ("WHS", 6, "Femme", 4, 280, 310);
INSERT INTO trou VALUES ("WHS", 7, "Femme", 4, 140, 160);
INSERT INTO trou VALUES ("WHS", 8, "Femme", 3, 420, 460);
INSERT INTO trou VALUES ("WHS", 9, "Femme", 4, 440, 490);



-- Les tournois 
INSERT INTO `tournoi` (`AnneeSaison`, `IdTournoi`, `nomTournoi`, `dateDebut`, `dateFin`, `IdParcours`, `lieu`, `description`) VALUES
(2022, 1, 'Masters', '2022-04-04', '2022-04-10', 'HLS', 'Augusta (États-Unis)', 'Le Masters (ou le Tournoi des Maîtres) est l\'un des quatre tournois annuels qui composent le Grand Chelem dans le golf professionnel masculin mondial (en compagnie de l\'Open américain, l\'Open britannique et le Championnat de la PGA). Disputé traditionnellement la seconde semaine d\'avril, il est le premier des quatre chelems de l\'année. Il se déroule toujours au même endroit : le parcours privé Hillside, proche de Liverpool.'),
(2022, 2, 'US Open', '2022-06-16', '2022-06-19', 'HC', 'États-Unis', 'L\'US Open de golf, ou simplement dénommé le US Open, est l\'un des quatre tournois majeurs du golf professionnel masculin (avec le Masters, le British Open et le championnat de la PGA). Il s\'agit d\'un tournoi disputé annuellement sur un parcours de golf aux États-Unis : le parcours privé Hankley Common.\r\n'),
(2022, 3, 'British Open', '2022-07-14', '2022-07-17', 'STW', 'Royaume-Uni', 'L’Open britannique (The Open Championship au Royaume-Uni ou British Open aux États-Unis) est un tournoi de golf masculin, créé en 1860, se déroulant chaque année au Royaume-Uni. Organisé par le R&A Golf Club of St Andrews, il s\'agit du plus ancien tournoi de golf du monde. Tournoi de référence jusqu\'aux années 1930, il retrouve son standing à partir des années 1960 en devenant l\'un des tournois du grand chelem. Ce tournoi annuel a lieu sur le célèbre parcours Saunton West.'),
(2022, 4, 'PGA Championship', '2022-05-19', '2022-05-22', 'RSD', 'États-Unis', 'Le PGA Championship (en français : Championnat de la PGA) est un tournoi de golf professionnel masculin, créé en 1916, se déroulant chaque année aux États-Unis, organisé par l\'association des golfeurs professionnels américains (PGA of America). Il s\'agit de l\'un des quatre tournois majeurs, qui composent le grand chelem (avec le Masters, l\'Open américain et l\'Open britannique), qui annuellement en est le dernier volet. Ce tournoi qui clôture ce grand chelem, se déroule sur le très difficile parcours Royal St. Davids.'),
(2023, 1, 'Masters', '2023-04-04', '2023-04-10', 'HLS', 'Augusta (États-Unis)', 'Le Masters (ou le Tournoi des Maîtres) est l\'un des quatre tournois annuels qui composent le Grand Chelem dans le golf professionnel masculin mondial (en compagnie de l\'Open américain, l\'Open britannique et le Championnat de la PGA). Disputé traditionnellement la seconde semaine d\'avril, il est le premier des quatre chelems de l\'année. Il se déroule toujours au même endroit : le parcours privé Hillside, proche de Liverpool.'),
(2023, 2, 'US Open', '2023-06-16', '2023-06-19', 'HC', 'États-Unis', 'L\'US Open de golf, ou simplement dénommé le US Open, est l\'un des quatre tournois majeurs du golf professionnel masculin (avec le Masters, le British Open et le championnat de la PGA). Il s\'agit d\'un tournoi disputé annuellement sur un parcours de golf aux États-Unis : le parcours privé Hankley Common.\r\n'),
(2023, 3, 'British Open', '2023-07-14', '2023-07-17', 'STW', 'Royaume-Uni', 'L’Open britannique (The Open Championship au Royaume-Uni ou British Open aux États-Unis) est un tournoi de golf masculin, créé en 1860, se déroulant chaque année au Royaume-Uni. Organisé par le R&A Golf Club of St Andrews, il s\'agit du plus ancien tournoi de golf du monde. Tournoi de référence jusqu\'aux années 1930, il retrouve son standing à partir des années 1960 en devenant l\'un des tournois du grand chelem. Ce tournoi annuel a lieu sur le célèbre parcours Saunton West.');
