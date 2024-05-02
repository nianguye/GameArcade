"use strict";
/* NOTE TO SELF: , IMPLEMENT DOUBLE, then imeplemtn moeny */
const maxValue = 21;

function getID(id) {
    return document.getElementById(id);
}

/* return first element that matches css selector ex: #title h1 */
function getQuery(selector) {
    return document.querySelector(selector);
}

function getQueryAll(selector) {
    return document.querySelectorAll(selector);
}

function generateTag(tag) {
    return document.createElement(tag);
}

let cardList  = [];

/* Create the card list*/
/* Note: In Blackjack, the user shouldn't know how many cards are in a deck, hence cards can get repicked*/
/* Note: 1 can also be 11, this can be added as an edge case so implement later */
for (let i = 2; i < 10; i++) {
    cardList.push({value: i, cardpng: "playingcards/card-diamonds-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-clubs-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-hearts-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-spades-" + i + ".png"});
}
/* Add the face cards */
for (let i = 10; i < 14; i++) {
    cardList.push({value: 10, cardpng: "playingcards/card-diamonds-" + i + ".png"});
    cardList.push({value: 10, cardpng: "playingcards/card-clubs-" + i + ".png"});
    cardList.push({value: 10, cardpng: "playingcards/card-hearts-" + i + ".png"});
    cardList.push({value: 10, cardpng: "playingcards/card-spades-" + i + ".png"});
}
/* Aces */
cardList.push({value: 11, cardpng: "playingcards/card-diamonds-" + 1 + ".png"});
cardList.push({value: 11, cardpng: "playingcards/card-clubs-" + 1 + ".png"});
cardList.push({value: 11, cardpng: "playingcards/card-hearts-" + 1 + ".png"});
cardList.push({value: 11, cardpng: "playingcards/card-spades-" + 1 + ".png"});


(function() {
    /* Reference from Lecture/AI, basically, we wait for the website to load before doing any interactions */
    window.addEventListener("load", init);

    function init() {
        let backCard = {value: 1, cardpng: "playingcards/card-diamonds-1.png"}
        let board = getID("game");
        let playerDeck = getID("playerDeck");
        let dealerDeck = getID("dealerDeck");
        let buttons = getID("buttons")
        let play = getQuery(".inputButton");
        let stand = generateTag("button");
        let hit = generateTag("button");      
        let replay = generateTag("button");   
        let playerValue = 0;
        let playerAces = 0; /* for soft 1 and 11s */
        let dealerValue = 0;
        let dealerAces = 0; /* for soft 1 and 11s */
        play.addEventListener("click", setTable);
        hit.addEventListener("click", hitCard);
        stand.addEventListener("click", standCard);
        replay.addEventListener("click", setTable)

        /* Delete the play button and put two cards in dealer hand and player hand */
        /* Then we can set up the game */
        function setTable() {
            /* reset */
            backCard = {value: 11, cardpng: "playingcards/card-back1.png"}
            playerAces = 0;
            dealerAces = 0;
            dealerDeck.innerHTML = "";
            playerDeck.innerHTML = "";
            buttons.innerHTML = "";
            /* Make it cleare everything after using innerhtml */
            /* Return a card from cardList */
            let cardOne = generateCard(true);
            let cardTwo = generateCard(true);
            let dealerOne = generateCard(false);
            let dealerTwo = generateCard(false);
            playerValue = cardOne.value + cardTwo.value;
            dealerValue = dealerOne.value + dealerTwo.value;
            /*Add PNG of player and dealer cards along with the hit/stand/double buttons*/
            /* Note to self, we can add animations after */
            function displayCards(resolve,reject) {
                setTimeout(displayCard,500, cardOne, playerDeck);
                setTimeout(displayCard,1000, cardTwo, playerDeck);
                setTimeout(displayCard,1500, dealerOne, dealerDeck);
                setTimeout(displayCard,2000, backCard, dealerDeck);
                backCard = dealerTwo;
                setTimeout(resolve, 2500);
            }

            
            let startGame = new Promise(displayCards)
            /* Instant win or lose condition */
            startGame
                .then(function(){
                    if (playerValue == 21) {
        
                        generateStat(true);
                        buttons.innerHTML = "";
                        replay.textContent = "Replay";
                        replay.classList.add("inputButton");
                        buttons.appendChild(replay);       
                        return; 
                    }
                    else if (dealerValue == 21) {
                        generateStat(false);
                        let secondCard = getQueryAll("#dealerDeck img");
                        secondCard[secondCard.length - 1].remove();
                        displayCard(backCard, dealerDeck);
                        buttons.innerHTML = "";
                        replay.textContent = "Replay";
                        replay.classList.add("inputButton");
                        buttons.appendChild(replay);       
                        return;             
                    }
                    play.remove();
                    /* Create the stand, hit buttons */
                    stand.textContent = "Stand";
                    hit.textContent = "Hit";
                    stand.classList.add("inputButton");
                    hit.classList.add("inputButton");
                    buttons.appendChild(stand);
                    buttons.appendChild(hit);
                });
        }
            /* Hitting stand*/
        function hitCard() {
            let newCard = generateCard(true);
            function displayCurrentCard(resolve,reject) {
                setTimeout(displayCard,500, newCard, playerDeck);
                setTimeout(resolve, 1000);
            }            
            let hitPromise = new Promise(displayCurrentCard)
            hitPromise
                .then(function() {
                    playerValue += newCard.value;
                    while (playerAces > 0 && playerValue > maxValue) {
                        playerValue -= 10;
                        playerAces-= 1;
                    }
                    if (playerValue > maxValue) {
                        generateStat(false);
                        let secondCard = getQueryAll("#dealerDeck img");
                        secondCard[secondCard.length - 1].remove();
                        displayCard(backCard, dealerDeck);
                        /* Add function that deals with lost/wins */
                        buttons.innerHTML = "";
                        replay.textContent = "Replay";
                        replay.classList.add("inputButton");
                        buttons.appendChild(replay);
                    }
                
                    /* Edge case of 21 */
                    if (playerValue == maxValue) {
                        standCard();
                    }
                });
        }

        function standCard() {
            let secondCard = getQueryAll("#dealerDeck img");
            secondCard[secondCard.length - 1].remove();
            displayCard(backCard, dealerDeck);
            function displayDealerCards(resolve, reject) {
                let current = 1;
                while (dealerValue < 17) {
                    let newCard = generateCard(false);
                    setTimeout(displayCard,current * 500,newCard, dealerDeck);
                    dealerValue += newCard.value;
                    /* If over 21, reduce it */
                    while (dealerAces > 0 && dealerValue > maxValue) {
                        dealerValue -= 10;
                        dealerAces-= 1;
                    }
                    current++;
                    
                }
                            
                setTimeout(resolve, 500 * current);
            }
            let resultPromise = new Promise(displayDealerCards) 
            resultPromise
                .then(function(){
                    if (dealerValue > 21 || playerValue > dealerValue) {
                        generateStat(true);
                    }
                    else if (dealerValue > playerValue) {
                        generateStat(false);
                    }
                    else {
                        let victoryButton = generateTag("section");
                        victoryButton.classList.add("victoryScreen");
                        victoryButton.textContent = "Push";
                        playerDeck.appendChild(victoryButton);
                    }
                    buttons.innerHTML = "";
                    replay.textContent = "Replay";
                    replay.classList.add("inputButton");
                    buttons.appendChild(replay);
                });
        }

        function generateCard(val) {
            let result = cardList[Math.floor(Math.random() * 52)];
            if (result.value == 11 && val) {
                playerAces += 1;
            }
            else if (result.value == 11 && !val) {
                dealerAces += 1;
            }
            return result;
        }
        /* Location is either dealer deck or player deck */
        function displayCard(card, location) {
            let cardImage = generateTag("img");
            cardImage.classList.add("cardClass");
            cardImage.src = card.cardpng;
        
            location.appendChild(cardImage);
        }

        function generateStat(result) {
            if (result == true) {
                let victoryButton = generateTag("section");
                victoryButton.classList.add("victoryScreen");
                victoryButton.textContent = "YOU WIN";
                playerDeck.appendChild(victoryButton);
            }
            else {
                let victoryButton = generateTag("section");
                victoryButton.classList.add("defeatScreen");
                victoryButton.textContent = "YOU LOSE";
                playerDeck.appendChild(victoryButton);
            }
        }
    }
})();