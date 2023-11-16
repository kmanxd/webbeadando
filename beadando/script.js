function createCard(color, number) {
    return {
        color: color,
        number: number,
    };
}

function createDeck() {
    let colors = ['red', 'blue', 'green', 'yellow'];
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    let deck = [];

    colors.forEach(color => {
        numbers.forEach(number => {
            deck.push(createCard(color, number));
        });
    });

    return deck;
}

function dealHand(deck, numCards) {
    let hand = [];

    for (let i = 0; i < numCards; i++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        hand.push(deck.splice(randomIndex, 1)[0]);
    }

    return hand;
}

function drawCard() {
    if (drawPile.length > 0) {
        let drawnCard = drawPile.pop();
        playerHand.push(drawnCard);
        drawPile = dealHand(createDeck(), 1);
        updateGameBoard();
    } else {
        console.log("The drawpile is empty!");
    }
}
function opponentPlayCard(){
    let placed = false;
    for (let i = 0; i < opponentHand.length; i++){
        if ((opponentHand[i].color === discardPile[discardPile.length-1].color) || (opponentHand[i].number === discardPile[discardPile.length-1].number) || (discardPile[discardPile.length-1].number === 10)){
            placed = true;
            let selectedOppCard = opponentHand[i];
            opponentHand.splice(i, 1);
            discardPile.push(selectedOppCard);
            if (selectedOppCard.number === 0) {
                playerDrawCards(2);
                setTimeout(() => {
                    opponentPlayCard();
                }, 1000);
            }
            if (selectedOppCard.number === 10 && (selectedOppCard.color === "yellow" || selectedOppCard.color == "blue")){
                playerDrawCards(4);
                setTimeout(() => {
                    opponentPlayCard();
                }, 1000);
            }
            if(selectedOppCard.number === 11 || selectedOppCard.number === 12){
                canPlayerInteract = false;
                setTimeout(() => {
                    canPlayerInteract = true;
                    opponentPlayCard();
                }, 1000);
            }
            break;
        }
    }
    if (!placed) {
        opponentDrawCards(1);
    }

    if (opponentHand.length === 0){
        hasGameEnded();
    }

    updateGameBoard();
}

let canPlayerInteract = true;
let gameEnd = true;

function playCard(index) {
    if (!canPlayerInteract) {
        return;
    }
    if (!gameEnd) {
        return;
    }

    let selectedCard = playerHand[index];

    if (canPlayCard(selectedCard)) {
        playerHand.splice(index, 1);
        discardPile.push(selectedCard);

        if (selectedCard.number === 0) {
            opponentDrawCards(2);
            if (playerHand.length === 0){
                if (hasGameEnded()){
                    let winnerMessage = playerHand.length === 0 ? 'Player Wins!' : 'Opponent Wins!';
                    displayWinner(winnerMessage);
                    gameEnd = false;
                }
            }
        }
        else{
            if (selectedCard.number === 10 && (selectedCard.color === "yellow" || selectedCard.color == "blue")){
                opponentDrawCards(4);
                if (playerHand.length === 0){
                    if (hasGameEnded()){
                        let winnerMessage = playerHand.length === 0 ? 'Player Wins!' : 'Opponent Wins!';
                        displayWinner(winnerMessage);
                        gameEnd = false;
                    }
                }
            }
            else{
                if (selectedCard.number === 11 || selectedCard.number === 12){
                    if (playerHand.length === 0){
                        if (hasGameEnded()){
                            let winnerMessage = playerHand.length === 0 ? 'Player Wins!' : 'Opponent Wins!';
                            displayWinner(winnerMessage);
                            gameEnd = false;
                        }
                    }
                }
                else{
                    canPlayerInteract = false;
                    setTimeout(() => {
                        if (playerHand.length === 0){
                            if (hasGameEnded()){
                                let winnerMessage = playerHand.length === 0 ? 'Player Wins!' : 'Opponent Wins!';
                                displayWinner(winnerMessage);
                                gameEnd = false;
                            }
                        }
                        else{
                            opponentPlayCard();
                            canPlayerInteract = true;
                        }
                    }, 1000);
                }
            }
        }
        updateGameBoard();
        if (playerHand.length === 1){
            unoPressed();
        }
    } else {
        console.log("You can't play this card!");
    }
}

function handleCardClick(index) {
    if (canPlayerInteract && index >= 0 && index < playerHand.length) {
        playCard(index);
    } else {
        console.log("Invalid card selection!");
    }
}

function opponentDrawCards(numCards) {
    for (let i = 0; i < numCards; i++) {
        let drawnCard = drawPile.pop();
        drawPile = dealHand(createDeck(), 1);
        opponentHand.push(drawnCard);
    }
}

function playerDrawCards(numCards) {
    for (let i = 0; i < numCards; i++) {
        let drawnCard = drawPile.pop();
        drawPile = dealHand(createDeck(), 1);
        playerHand.push(drawnCard);
    }
}

function handleCardClick(index) {
    if (index >= 0 && index < playerHand.length) {
        playCard(index);
    } else {
        console.log("Invalid card selection!");
    }
}

function canPlayCard(card) {
    let topDiscardCard = discardPile[discardPile.length - 1];

    if (card.number == 10)
    {
        return true;
    }
    else if (topDiscardCard.number == 10) {
        return true;
    }
    else{
        return card.color === topDiscardCard.color || card.number === topDiscardCard.number;
    }
}

function handleDrawCardClick() {
    if(!canPlayerInteract){
        return;
    }
    if (!gameEnd) {
        return;
    }
    playerDrawCards(1);
    canPlayerInteract = false;
    setTimeout(() => {
        opponentPlayCard();
        canPlayerInteract = true;
    }, 1000);
    updateGameBoard();
}

function renderCard(card, index, clickHandler, isOpponentCard) {
    let cardImage2 = "img/" + card.color + card.number + ".png";
    let cardImage = isOpponentCard ? "img/UNO-Back.png" : cardImage2;
    return `<div class="card" style="background-image: url(${cardImage}); background-size: cover; width: 70px; height: 100px;" onclick="${clickHandler}(${index})" onmouseover="addHoverEffect(this)" onmouseout="removeHoverEffect(this)"></div>`;
}

function addHoverEffect(element) {
    element.classList.add('hovered');
}

function removeHoverEffect(element) {
    element.classList.remove('hovered');
}


function renderHand(hand, clickHandler, isOpponentHand) {
    return hand.map((card, index) => renderCard(card, index, clickHandler, isOpponentHand)).join('');
}

function hasGameEnded() {
    if (playerHand.length === 0 || opponentHand.length === 0) {
        canPlayerInteract = false;
        return true;
    }
}

async function unoPressed() {
    canPlayerInteract = false;
    let image = document.getElementById('gombkep');
    image.style.filter = 'none';

    let timer = 0;
    let pressed = false;

    for (let i = 0; i < 5; i++) {
        document.getElementById('control-button').addEventListener('click', function () {
            if (timer < 5) {
                canPlayerInteract = true;
                image.style.filter = 'grayscale(100%)';
                updateGameBoard();
                pressed = true;
            }
        });

        if (pressed) {
            break;
        }
        
        await new Promise(resolve => {
            setTimeout(() => {
                timer += 1;
                resolve();
            }, 1000);
        });

        if (timer === 5) {
            playerDrawCards(2);
            opponentPlayCard();
        }
    }

    canPlayerInteract = true;
    image.style.filter = 'grayscale(100%)';
    updateGameBoard();
}

function displayWinner(message) {
    updateGameBoard();
    document.getElementById('winner-overlay').style.display = 'flex';
    var winner = document.getElementById('winner');
    winner.innerHTML = message;
    canPlayerInteract = false;
}

function updateGameBoard() {
    let playerHandElement = document.getElementById('player-hand');
    playerHandElement.innerHTML = renderHand(playerHand, 'handleCardClick', false);

    let opponentHandElement = document.getElementById('opponent-hand');
    opponentHandElement.innerHTML = renderHand(opponentHand, 'handleCardClick', true);

    let discardPileElement = document.getElementById('discard-pile');
    discardPileElement.innerHTML = renderCard(discardPile[discardPile.length - 1], -1, 'handleCardClick', false);

    let drawPileElement = document.getElementById('draw-pile');
    drawPileElement.innerHTML = renderCard(drawPile[drawPile.length - 1], -1, 'handleDrawCardClick', true);
}

let playerHand = dealHand(createDeck(), 7);
let opponentHand = dealHand(createDeck(), 7);

let discardPile = dealHand(createDeck(), 1);
let drawPile = dealHand(createDeck(), 1);

updateGameBoard();