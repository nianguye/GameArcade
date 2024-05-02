"use strict";
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
for (let i = 1; i < 10; i++) {
    cardList.push({value: i, cardpng: "playingcards/card-diamonds-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-clubs-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-hearts-" + i + ".png"});
    cardList.push({value: i, cardpng: "playingcards/card-spades-" + i + ".png"});
}
/* Add the face cards */
for (let i = 10; i < 14; i++) {
    cardList.push({value: 0, cardpng: "playingcards/card-diamonds-" + i + ".png"});
    cardList.push({value: 0, cardpng: "playingcards/card-clubs-" + i + ".png"});
    cardList.push({value: 0, cardpng: "playingcards/card-hearts-" + i + ".png"});
    cardList.push({value: 0, cardpng: "playingcards/card-spades-" + i + ".png"});
}


(function() {
    /* Reference from Lecture/AI, basically, we wait for the website to load before doing any interactions */
    window.addEventListener("load", init);

    function init() {
        let hands = getID("hands");
        let screen = getID("screen");
        let buttons = getID("buttons")
        let play = getQuery(".inputButton");
        // Default true
        let playerChoice = true;
        let playerValue = 0;
        let bankerValue = 0;
        let playerButton = generateTag("button");
        let bankerButton = generateTag("button");
        let playerHand = generateTag("div");
        let bankerHand = generateTag("div");
        let replay = generateTag("button"); 
        play.addEventListener("click", chooseOptions);
        bankerButton.addEventListener("click", swapChoice);
        playerButton.addEventListener("click", gameStart);
        replay.addEventListener("click", clearDeck);
        function chooseOptions() {
            play.remove();
            playerButton.classList.add("inputButton");
            bankerButton.classList.add("inputButton");
            playerButton.textContent = "Player";
            bankerButton.textContent = "Banker";
            buttons.appendChild(playerButton);
            buttons.appendChild(bankerButton);
        
        }
        function swapChoice() {
            playerChoice = false;
            gameStart();
        }
        function clearDeck() {
            playerValue = 0;
            bankerValue = 0;
            playerChoice = true;
            hands.innerHTML = "";
            screen.innerHTML = "";
            playerHand.innerHTML = "";
            bankerHand.innerHTML = "";
            replay.remove();
            chooseOptions();
        }
        function gameStart() {
            playerHand.classList.add("baccaratHand");
            bankerHand.classList.add("baccaratHand");
            hands.appendChild(playerHand);
            hands.appendChild(bankerHand);
            /* Deal hands */
            let cardThree = 0;
            let cardOne = generateCard();
            let bankerOne = generateCard();
            let cardTwo = generateCard();
            let bankerTwo = generateCard();

            function displayCards(resolve,reject) {
                setTimeout(displayCard,500,cardOne, playerHand);
                setTimeout(displayCard,1000,bankerOne,bankerHand);
                setTimeout(displayCard,1500,cardTwo, playerHand);
                setTimeout(displayCard,2000,bankerTwo, bankerHand);
                setTimeout(resolve,2500);
            }
            let gameStart = new Promise(displayCards);
            gameStart 
                .then(function(resolve, reject) {
                    playerValue = cardOne.value + cardTwo.value;
                    bankerValue = bankerOne.value + bankerTwo.value;
                    if ((playerValue == 8 || playerValue == 9) || (bankerValue == 8 || bankerValue == 9))  {
                        endCondition();
                    }
                    else {
                        if (playerValue < 6) {
                            let cardThree = generateCard();
                            setTimeout(displayCard,500,cardThree, playerHand);
                            playerValue += cardThree.value;
                            setTimeout(bankerDraw,1000,cardThree.value);
                            setTimeout(endCondition, 1500);
                        
                        }
                        else {  
                            endCondition();          
                        }
                    }
                    playerButton.remove();
                    bankerButton.remove();
                    buttons.innerHTML = "";
                    replay.textContent = "Replay";
                    replay.classList.add("inputButton");
                    buttons.appendChild(replay); 
                })
                
        }

        function bankerDraw(value) {
            let bankerFirstTwo = bankerValue;
            if (bankerFirstTwo < 3) {
                let newCard = generateCard();
                displayCard(newCard, bankerHand);
                bankerValue += newCard.value;
            }
            else if (bankerFirstTwo == 3) {
                if (value != 8) {
                    let newCard = generateCard();
                    displayCard(newCard, bankerHand);
                    bankerValue += newCard.value;
                }
            }
            else if (bankerFirstTwo == 4) {
                if (value != 1 && value != 8 && value != 9 && value != 0) {
                    let newCard = generateCard();
                    displayCard(newCard, bankerHand);
                    bankerValue += newCard.value;
                }
            }
            else if (bankerFirstTwo == 5) {
                if (value == 4 || value == 5 ||  value == 6 || value == 7) {
                    let newCard = generateCard();
                    displayCard(newCard, bankerHand);
                    bankerValue += newCard.value;                    
                }
            }
            else if (bankerFirstTwo == 6) {
                if (value == 6 || value == 7) {
                    let newCard = generateCard();
                    displayCard(newCard, bankerHand);
                    bankerValue += newCard.value;                         
                }
            }

        }
        function endCondition() {
            if (Math.abs(playerValue - 9) < Math.abs(bankerValue - 9)) {
                if (playerChoice) {
                    generateStat(true);
                }
                else {
                    generateStat(false);
                }
            }
            else if (Math.abs(playerValue - 9) > Math.abs(bankerValue - 9)) {
                if (!playerChoice) {
                    generateStat(true);
                }
                else {
                    generateStat(false);
                }
            }
            else {
                let victoryButton = generateTag("section");
                victoryButton.classList.add("victoryScreen");
                victoryButton.textContent = "PUSH";
                screen.appendChild(victoryButton);
            }
   

        }
        function generateCard() {
            let result = cardList[Math.floor(Math.random() * 52)];
            return result;
        }
        /* Location is either dealer deck or player deck */
        function displayCard(card, location) {
            let cardImage = generateTag("img");
            cardImage.src = card.cardpng;
            cardImage.classList.add("cardClassBaccarat");
            location.appendChild(cardImage);
        }

        function generateStat(result) {
            if (result == true) {
                let victoryButton = generateTag("section");
                victoryButton.classList.add("victoryScreen");
                victoryButton.textContent = "YOU WIN";
                screen.appendChild(victoryButton);
            }
            else {
                let victoryButton = generateTag("section");
                victoryButton.classList.add("defeatScreen");
                victoryButton.textContent = "YOU LOSE";
                screen.appendChild(victoryButton);
            }
        }
    }
})();
