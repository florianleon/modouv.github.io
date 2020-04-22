$(function() {
    let monCanvas;
    let ctx;
    let tempsJeu;
    let ecranCourant;
    let niveauCourant;
    let score;
    let xSourisCanvas;
    let ySourisCanvas;
    let listeBulles;
    let nbBulles;
    let vitesse;
    let nombreVies;
    let intervalleRafraichissement; 
    let intervalleNouvelleBulle;
    let proportionBullesNoires;
    let tempsLimite;
    let listeCouleurs;
    let intervalleChangementVitesse; 
    let incrementVitesse;
    let rayonBulleBleue;
    init();
});
    function init() {
        //structure

        //parametre (données non modifiables et non modifiées par le jeu) - variable globale}
        intervalleRafraichissement = 80; 
        intervalleNouvelleBulle = 4; //22 500 bulles
        proportionBullesNoires = 20;
        tempsLimite = 90000;
        listeCouleurs = {"B":"#0000ff","V":"#00c000","N":"#555"};
        intervalleChangementVitesse = 22560; //pour 3 niveaux
        incrementVitesse = 1;
        rayonBulleBleue = 8;

        //initialisation des variables

        monCanvas = $("#dessin")[0]; //je ne sais pas pourquoi c'est necessaire pour ca fonctionne correctement…
        ctx = monCanvas.getContext('2d');
        tempsJeu = 0;
        ecranCourant = null;
        niveauCourant = 1;
        score = 0;
        //position de la souris
        xSourisCanvas = monCanvas.width/2;
        ySourisCanvas = monCanvas.height/2;
        listeBulles = [];
        //nbre total des bulles sans la bulle bleue
        nbBulles = 0;
        //vitesse initiale de bulles en px/s
        vitesse = 4;
        //nbre initial de vie
        nombreVies = 3;
        
        //let ctx = monCanvas.getContext('2d');

        //gestionnaires
        $("#boutonJouer").click(function(){
           afficheEcranJeu(); 
        });
        $("#boutonQuitter").click(function(){
            afficheEcranAccueil(); 
        });
        $("#boutonRejouer").click(function(){
            reinitialisation();
            afficheEcranJeu(); 
        });
        $("#boutonAccueil").click(function(){
            afficheEcranAccueil(); 
        });
        monCanvas.addEventListener("mousemove", positionSouris, false);

        //moteur de règles
        let inter = setInterval(regles, intervalleRafraichissement);
        
        //lancement : affichage de la page d'acceuil
        afficheEcranAccueil();
    }

    function positionSouris(e) { 
        let xSourisDocument = e.pageX;
        let ySourisDocument = e.pageY;
        let xCanvas = monCanvas.offsetLeft;
        let yCanvas = monCanvas.offsetTop;
        xSourisCanvas = xSourisDocument - xCanvas;
        ySourisCanvas = ySourisDocument - yCanvas;
    }

    function reinitialisation() {
        tempsJeu = 0;
        ecranCourant = null;
        niveauCourant = 1;
        score = 0;
        //position de la souris
        xSourisCanvas = monCanvas.width/2;
        ySourisCanvas = monCanvas.height/2;
        listeBulles = [];
        //nbre total des bulles sans la bulle bleue
        nbBulles = 0;
        //vitesse initiale de bulles en px/s
        vitesse = 4;
        //nbre initial de vie
        nombreVies = 3;
    }

    function afficheEcranAccueil() {
        ecranCourant = "ecranAccueil";
        $("#ecranAccueil").show();
        $("#ecranJeu").hide();
        $("#ecranBilan").hide();
        reinitialisation();
    }
    function afficheEcranJeu() {
        ecranCourant = "ecranJeu";
        $("#ecranAccueil").hide();
        $("#ecranJeu").show();
        $("#ecranBilan").hide();
    }
    function afficheEcranBilan() {
        ecranCourant = "ecranBilan";
        $("#ecranAccueil").hide();
        $("#ecranJeu").hide();
        $("#ecranBilan").show();
        $("#scoreFinal").html("Score : " + score);
        $("#niveauFinal").html("Niveau : " + (niveauCourant - 1));
    }
    
    function regles() {
        if (ecranCourant === "ecranJeu") {
            //animation
            animer();
        }
    }

    function animer() {
        //1- temps de jeu
        // tempsJeu = tempsJeu + intervalleRafraichissement;
        if (tempsJeu % tempsLimite === 0 && tempsJeu !== 0) {
            afficheEcranBilan();
            alert("Félicitation ! Vous avez gagné !");
        } else {
            tempsJeu = tempsJeu + intervalleRafraichissement;
        }
        // 2- création des bulles N et V - test sur le temps 
        if (tempsJeu % intervalleNouvelleBulle === 0) {
            //creation d'une nouvelle bulle -> test s'il est temps de creer une verte
            if (listeBulles.length % proportionBullesNoires === 0 && listeBulles.length !== 0) {
                creeBulle("V");
            } else {
                creeBulle("N");
            }
        }
        //3- dessin des bulles
        ctx.clearRect(0,0, monCanvas.width, monCanvas.height);
        for (let j=0; j<listeBulles.length; j++) {
            let bulle = listeBulles[j];
            dessineBulle(bulle, j);
        }
        //4 - dessin de la bulle bleue (ne fait pas partie de la liste)
        dessineBulle([xSourisCanvas, ySourisCanvas, "B", rayonBulleBleue, true], null);
        //5 - affichage
        $("#score").html("Score : " + score);
        $("#vies").html("Vies : " + nombreVies);
        $("#niveau").html("Niveau : " + niveauCourant);
        $("#temps").html("Temps : " + tempsJeu/1000);
        //Mise a jour du niveau
        if (tempsJeu % intervalleChangementVitesse === 0) {
            //changement de niveau
            vitesse += incrementVitesse;
            //intervalleNouvelleBulle--;
            niveauCourant++;
        }
        
        //On affiche l'ecran de bilan quand on a plus de vies
        if (nombreVies <= 0) {
            afficheEcranBilan();
            alert("Vous avez perdu ! :'(");
        }
    }

    function getRandomX(rayon) { 
        let tailleCanvas = monCanvas.offsetLeft + monCanvas.width;
        let pos = Math.random() * tailleCanvas;
        pos = Math.round(pos);
        if (pos < rayon*2) {//si x > au diametre du la bulle on la repositionne
            pos += rayon;
        } else if (pos > (tailleCanvas - rayon*2)) {
            pos -= rayon;
        }
        return pos;
    }
    function getRandomRad() { 
        return Math.round(Math.random() * 4 + 4);
    }

    function creeBulle(couleur) {
        let rayon = getRandomRad();
        let x = getRandomX(rayon);
        let y = 0; //monCanvas.offsetTop;
        let visible = true;
        let tab = [x, y, couleur, rayon, visible];
        listeBulles.push(tab);
        nbBulles++;
    }

    function dessineBulle(tab, e_id){
        let eid = e_id;
        let x = tab[0];
        let y = tab[1] + vitesse*intervalleRafraichissement/1000;
        let couleur = tab[2];
        let rayon = tab[3];
        let visible = tab[4];
        let newY = y + vitesse;
        if (visible === true) {
            ctx.beginPath();
            ctx.fillStyle = listeCouleurs[couleur];
            ctx.arc(x, y, rayon, 2 * Math.PI, false);
            ctx.lineWidth = 2; 
            ctx.strokeStyle = 'black'; 
            ctx.stroke();
            ctx.fill();
        }
        if (eid !== null) {
            listeBulles[eid] = [x, newY, couleur, rayon, visible];
            y = newY;
        }
        //ca marche pas mais y'a du mieux
        let distancex = Math.abs(x - xSourisCanvas);//Distance entre le centre de la bulle et la bulle bleue
        let distancey = Math.abs(y - ySourisCanvas);
        if (eid !== null && (distancex * distancex + distancey*distancey <= (rayonBulleBleue*rayonBulleBleue)) && visible === true) {
            if (couleur === "N") {
                nombreVies--;
            } else {
                score++;
            }
            listeBulles[eid] = [x, y, couleur, rayon, false];
        }

    }
