const JeuxMemoire = (function () {

const cards = document.querySelectorAll(".card");
const newGameButton = document.getElementById("new-game-button")
const stopGameButton = document.getElementById("stop-game-button")


let matchedPairs = 0;
let cardTwo = null
let disableDeck = false
let startTime = null
let timerId = null
let gameIsRunning = false

function startNewGame() {

    // Réinitialiser les variables et l'état du jeu
    console.log("Nouvelle partie démarrée");

    matchedPairs = 0
    console.log(matchedPairs)
    cardOne = null
    cardTwo = null
    disableDeck = false


    // Démarrer le minuteur
    startTime = new Date().getTime()
    timerId = setInterval(updateTimeElapsed, 1000)

    // Mélanger les cartes et les afficher
    shuffleCards()
    showAllCards()

     // Masquer le bouton "Nouvelle partie" et afficher le bouton "Arrêter la partie"
    newGameButton.style.display = "none"
    stopGameButton.style.display = "block"
    gameIsRunning = true
}







  // Fonction pour mettre à jour le temps écoulé sur le minuteur
function updateTimeElapsed() {
    if (!gameIsRunning) return;
    const timeElapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    document.getElementById("time-elapsed").innerHTML = "Temps: " + timeElapsed + "s";
}

// Fonction pour retourner une carte cliquée
function flipCard({ target: clickedCard }) {
    if (cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip")
        if (!cardOne) {
            cardOne = clickedCard
            return
        }
        cardTwo = clickedCard
        disableDeck = true
        const cardOneImg = cardOne.querySelector(".back-view img").src
        const cardTwoImg = cardTwo.querySelector(".back-view img").src
        matchCards(cardOneImg, cardTwoImg);
    }
}

 // Fonction pour vérifier si deux cartes sont identiques
function matchCards(image1, image2) {

    if (image1 === image2) {
         // Si les cartes sont identiques, ajouter 1 au nombre de paires trouvées
        matchedPairs++;
        document.getElementById("pairs-found").innerHTML = "Paires trouvées: " + matchedPairs

          // Si toutes les paires ont été trouvées, arrêter le jeu et réinitialiser
        if (matchedPairs === 8) {
            setTimeout(() => {
                showPopup();
                clearInterval(timerId);
                shuffleCards();
                resetGame();
            }, 1000)

        }
         // Retirer les gestionnaires d'événements de clic sur les deux cartes correspondantes
        cardOne.removeEventListener("click", flipCard)
        cardTwo.removeEventListener("click", flipCard)
        cardOne = cardTwo = null;
        disableDeck = false;
        return;
    }
     // Si les cartes ne sont pas identiques, secouer les cartes pour les indiquer comme incorrectes
    setTimeout(() => {
        cardOne.classList.add("shake")
        cardTwo.classList.add("shake")
    }, 400);
    setTimeout(() => {

        cardOne.classList.remove("shake", "flip")
        cardTwo.classList.remove("shake", "flip")
        cardOne = null;
        cardTwo = null;
        disableDeck = false;
    }, 1200);
}

function stopGame() {
    disableDeck = true
    console.log("Partie arrêtée !")
    cards.forEach((card) => {
        card.removeEventListener("click", flipCard)
    });
    stopGameButton.style.display = "none"
    newGameButton.style.display = "block"
    clearInterval(timerId);
    gameIsRunning = false


}



function resetGame() {
    // Réinitialiser le jeu
    matchedPairs = 0;
    cardOne = null;
    cardTwo = null;
    disableDeck = false;
    startTime = null;
    clearInterval(timerId);
    gameIsRunning = false;
    document.getElementById("pairs-found").innerHTML = "Paires trouvées: 0";
    document.getElementById("time-elapsed").innerHTML = "Temps: 0s";
    cards.forEach((card) => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    // Masquer le bouton "Arrêter la partie"
    stopGameButton.style.display = "none";
    // Afficher le bouton "Nouvelle partie"
    newGameButton.style.display = "block";
}

// melanger des cartes
function shuffleCards() {
    disableDeck = false
    cardOne = null
    cardTwo = null
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]
    arr.sort(() => Math.random() > 0.5 ? 1 : -1)
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img")
        imgTag.src = `image/image${arr[i]}.JPG`
        card.addEventListener("click", flipCard)
    });
}

function showAllCards() {
    // Désactiver le deck pendant que toutes les cartes sont affichées
    disableDeck = true;

    // Afficher toutes les cartes pendant 3 secondes
    cards.forEach((card) => {
        card.classList.add("flip");
    });

    // Attendre 3 secondes avant de retourner les cartes
    setTimeout(() => {
        cards.forEach((card) => {
            card.classList.remove("flip");
        });
        // Réactiver le deck une fois que toutes les cartes sont retournées
        disableDeck = false;
    }, 3000);
}



  function showPopup() {
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    })
  }




return {
    init: function () {

        stopGameButton.addEventListener("click", stopGame)

        // Ajouter des gestionnaires d'événements aux boutons "Nouvelle partie" et "Arrêter la partie"
        newGameButton.addEventListener("click", startNewGame)
        stopGameButton.addEventListener("click", () => {
         console.log("Partie arrêtée !")
         // arrêter le minuteur lorsque le jeu est arrêté
         clearInterval(timerId);
         // Masquer le bouton "Arrêter la partie"
         stopGameButton.style.display = "none"

         // Afficher le bouton "Nouvelle partie"
         newGameButton.style.display = "block"
})
    }
}
})()

JeuxMemoire.init()

