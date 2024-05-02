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

(function() {
    /* Reference from Lecture/AI, basically, we wait for the website to load before doing any interactions */
    window.addEventListener("load", init);
    let games = getQueryAll(".contain img");

    function init() {
        games = getQueryAll(".contain img");
        games[0].addEventListener("mouseover", blackJackInstruction);
        games[1].addEventListener("mouseover", baccaratInstruction);
        games[2].addEventListener("mouseover", slotsInstruction);
        games[0].addEventListener("mouseleave", removeInstruction);
        games[1].addEventListener("mouseleave",removeInstruction);
        games[2].addEventListener("mouseleave", removeInstruction);
        
    }

    function blackJackInstruction (){
        let paragraph = getQuery("#tipsPage p");
        paragraph.textContent = 
        "Blackjack is a card game, where the player and dealer competes to get to highest value without passing 21. The game starts off where the player and dealer gets two cards." +
        " The cards from number 2 to 10 are their respective values, face cards are 10s and aces are either 1 or 11. The player can either hit to gain an extra card or stand to finish" +
        " dealing cards. The player can hit until they past 21. Once the player stands, the dealer reveals the second card and can also deal until they reach or pass 17. Closest to 21 wins";
    }

    function baccaratInstruction () {
        let paragraph = getQuery("#tipsPage p");
        paragraph.textContent = 
        "Baccarat is a card game, where theres a player and banker. The user plays by betting on if the player and banker will win. Once the user bets, the player and banker " +
        "receives two cards, where Ace to 9 are their respective values and face cards are 0. If the combined value of the player two cards are less than 6, the player can draw" +
        " a third card. The banker can also draw a card depending on the player's third card value and their combined card value. The person with the closest value to 9 wins."
    }
    function slotsInstruction () {
        let paragraph = getQuery("#tipsPage p");
        paragraph.textContent = 
        "Slots is a simple game, where you click play and three slots are rolled. Depending on the images of the slots determine the outcome of the game, which is shown on top." +
        " In order to win, the user needs to get the same image on all three of the slots. Otherwise, it resuls in a loss. The only exception is the joker icon. If two jokers appear " +
        "on the slots, it's given as a win. However, if all 3 jokers appear, it results in a loss."
    }

    function removeInstruction() {
        let paragraph = getQuery("#tipsPage p");
        paragraph.textContent = "";
    }
})();