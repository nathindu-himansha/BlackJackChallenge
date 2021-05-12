let blackJackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: { scoreSpan: "#dealer-blackjack-result", div: "#delaer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "K", "Q"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    A: [1, 11],
    J: 10,
    K: 10,
    Q: 10,
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  isTurnOver: false,
};

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];
const CARD = blackJackGame["cards"];

const hitSound = new Audio("static/asserts/sounds/swish.m4a");
const winSound = new Audio("static/asserts/sounds/cash.mp3");
const lostSound = new Audio("static/asserts/sounds/aww.mp3");

document.querySelector("#blackjack-hit-button").addEventListener("click", blackJackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click", blackJackDeal);

document.querySelector("#blackjack-deal-button").disabled = true;

function blackJackHit() {
  if (blackJackGame["isStand"] === false) {
    let card = randomCard();
    showCard(YOU, card);
    updateScore(YOU, card);
    showScore(YOU);
  }
}

function showCard(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.height = 100;
    cardImage.width = 80;
    cardImage.style = "margin:10px;";
    cardImage.src = `static/asserts/images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13);
  return CARD[randomNumber];
}

//reset
function blackJackDeal() {
  if (blackJackGame["isTurnOver"] === true) {
    let yourImages = document.querySelector("#your-box").querySelectorAll("img");
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    let dealersImages = document.querySelector("#delaer-box").querySelectorAll("img");
    for (let i = 0; i < dealersImages.length; i++) {
      dealersImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector(YOU["scoreSpan"]).textContent = 0;
    document.querySelector(YOU["scoreSpan"]).style.color = "white";
    document.querySelector(DEALER["scoreSpan"]).textContent = 0;
    document.querySelector(DEALER["scoreSpan"]).style.color = "white";

    document.querySelector("#blackjack-result").textContent = "GAME ON !";
    document.querySelector("#blackjack-result").style.color = "white";

    document.querySelector("#blackjack-hit-button").disabled = false;
    document.querySelector("#blackjack-stand-button").disabled = false;
    document.querySelector("#blackjack-deal-button").disabled = true;

    blackJackGame["isStand"] = false;
    blackJackGame["isTurnOver"] = false;
  }
}

function updateScore(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    if (card === "A") {
      if (activePlayer["score"] + blackJackGame["cardsMap"][card][1] <= 21) {
        activePlayer["score"] += blackJackGame["cardsMap"][card][1];
      } else {
        activePlayer["score"] += blackJackGame["cardsMap"][card][0];
      }
    } else {
      activePlayer["score"] += blackJackGame["cardsMap"][card];
    }
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] <= 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUSTED !";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  while (DEALER["score"] < 16 && blackJackGame["isStand"] === false) {
    document.querySelector("#blackjack-hit-button").disabled = true;
    document.querySelector("#blackjack-deal-button").disabled = false;

    let card = randomCard();
    showCard(DEALER, card);
    updateScore(DEALER, card);
    showScore(DEALER);
    await sleep(300);
  }
  blackJackGame["isStand"] = true;
  blackJackGame["isTurnOver"] = true;
  document.querySelector("#blackjack-stand-button").disabled = true;
  showResult(computeWinner());
}

function computeWinner() {
  let winner;

  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackJackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      winner = DEALER;
      blackJackGame["losses"]++;
    } else if (YOU["score"] === DEALER["score"]) {
      blackJackGame["draws"]++;
    }
  } else if (YOU["score"] > 21) {
    if (DEALER["score"] <= 21) {
      winner = DEALER;
      blackJackGame["losses"]++;
    } else if (DEALER["score"] > 21) {
      blackJackGame["draws"]++;
    }
  }
  return winner;
}

function showResult(winner) {
  let mesasage;
  let messageColor;

  if (winner === YOU) {
    mesasage = "YOU WON";
    messageColor = "green";
    winSound.play();
  } else if (winner === DEALER) {
    mesasage = "YOU LOST";
    messageColor = "red";
    lostSound.play();
  } else {
    mesasage = "GAME DREW";
    messageColor = "yellow";
  }

  document.querySelector("#blackjack-result").textContent = mesasage;
  document.querySelector("#blackjack-result").style.color = messageColor;
  updateTable();
}

function updateTable() {
  document.querySelector("#wins").textContent = blackJackGame["wins"];
  document.querySelector("#losses").textContent = blackJackGame["losses"];
  document.querySelector("#draws").textContent = blackJackGame["draws"];
}
