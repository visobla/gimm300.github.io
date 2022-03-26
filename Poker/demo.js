var Deck = require("./Deck");

var _ = require("lodash"); //require "lodash"
const express = require("express");
const app = express();
const http = require("http");
const e = require("express");
const server = http.createServer(app);
let gameList = [];
let gameData = {};

const socket = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Test");
});

function endGame(data, socket) {
  var pot;
  var highest;
  var highestUser;
  var deck;
  for (var x = 0; x < gameData[data.code].length; x++) {
    if (gameData[data.code][x].host) {
      pot = gameData[data.code][x].pot;
      gameData[data.code][x].pot = 0;
      deck = gameData[data.code][x].deck;
    }
    if (highestUser == undefined) {
      var temp = gameData[data.code][x].board.concat(
        gameData[data.code][x].cards
      );
      highestUser = gameData[data.code][x].user;
      highest = deck.checkMatch(temp);
    } else {
      var temp = gameData[data.code][x].board.concat(
        gameData[data.code][x].cards
      );
      temp = deck.checkMatch(temp);
      console.log(temp);
      if (highest.rank < temp.rank) {
        highestUser = gameData[data.code][x].user;
        highest = temp;
      } else if (highest.rank == temp.rank) {
        if (highest.highCard > temp.highCard) {
          highest = highest;
        } else {
          highest = temp;
          highestUser = gameData[data.code][x].user;
        }
      }
    }
  }
  console.log(highestUser);
  console.log(highest);
  for (var x = 0; x < gameData[data.code].length; x++) {
    if (highestUser == gameData[data.code][x].user) {
      gameData[data.code][x].money += pot;
      socket.emit("newPlayer");
      for (var x = 0; x < gameData[data.code].length; x++) {
        gameData[data.code][x].emit("newPlayer");
      }
      break;
    }
  }
  for (var x = 0; x < gameData[data.code].length; x++) {
    gameData[data.code][x].emit("reveal");
  }
}

//Generate the game ID and checks if it already exists
function makeId(length) {
  var result = "";
  var characters = "0123456789";
  for (var i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return gameList.includes(result) ? makeId(length) : result;
}

function mainBoard(deck) {
  var hands = [];
  for (var x = 0; x < 5; x++) {
    hands.push(deck.draw());
  }
  return hands;
}

function deal(players, deck) {
  var hands = [];
  for (var x = 0; x < players; x++) {
    hands[x] = [deck.draw(), deck.draw()];
  }
  return hands;
}

socket.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("continue", (data, callback) => {});
  socket.on("fold", (data, callback) => {
    var fold = 0;
    var notFold;
    var host;
    for (var x = 0; x < gameData[data.code].length; x++) {
      if (gameData[data.code][x].host) {
        host = x;
      }
      if (gameData[data.code][x].user == socket.user) {
        console.log("match", data.bet);
        gameData[data.code][x].fold = true;
        // console.log(gameData[data.code][x].money)
      }
    }
    for (var x = 0; x < gameData[data.code].length; x++) {
      if (gameData[data.code][x].fold) {
        fold++;
      } else {
        notFold = x;
      }
    }
    if (fold == gameData[data.code].length - 1) {
      gameData[data.code][notFold].money += gameData[data.code][host].pot;
      gameData[data.code][host].pot = 0;
    }
    callback("folded");
  });
  socket.on("refresh", (data, callback) => {
    console.log(data);
    socket.emit("newPlayer");
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].emit("newPlayer");
    }
    callback("Refreshed");
  });

  socket.on("bet", (data, callback) => {
    //console.log(data)

    for (var x = 0; x < gameData[data.code].length; x++) {
      if (gameData[data.code][x].user == socket.user) {
        var check = gameData[data.code][x].localBet + parseInt(data.bet);
        if (check < gameData[data.code][0].currentBet) {
          console.log("too little");
          callback({ error: true });
          return;
        }
        gameData[data.code][x].localBet += parseInt(data.bet);
        if (check > gameData[data.code][0].currentBet) {
          for (var y = 0; y < gameData[data.code].length; y++) {
            if (gameData[data.code][y].raiser) {
              gameData[data.code][y].raiser = false;
            }
          }
          gameData[data.code][x].raiser = true;

          if (gameData[data.code][0].currentBet == undefined) {
            gameData[data.code][0].currentBet = 0;
          }
          gameData[data.code][0].currentBet +=
            check - gameData[data.code][0].currentBet;
        }
        gameData[data.code][x].lastBet = true;
        console.log("match", data.bet);
        gameData[data.code][x].money -= data.bet;
        // console.log(gameData[data.code][x].money)
      }
      if (gameData[data.code][x].host) {
        if (gameData[data.code][x].pot == undefined) {
          gameData[data.code][x].pot = 0;
          gameData[data.code][x].pot += parseInt(data.bet);
        } else {
          //console.log("not undefiend", data)

          gameData[data.code][x].pot += parseInt(data.bet);
        }
      }
    }
    console.log("got here anyway");
    socket.emit("newPlayer");
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].emit("newPlayer");
    }

    callback("Bet Added");
  });

  socket.on("createGame", (data, callback) => {
    socket.user = data.name;
    // console.log(data.name)
    socket.money = 1500;
    socket.host = true;
    var temp = new Deck();
    temp.shuffleDeck();
    socket.deck = temp;
    socket.turn = true;

    //console.log("req",cards.draw())
    var code = makeId(5);
    gameList.push(code);
    gameData[code] = [];
    gameData[code].push(socket);
    //console.log(gameData[code])
    callback(code);
    socket.emit("newPlayer");
  });
  socket.on("joinLobby", (data, callback) => {
    //console.log("req",cards.draw())
    //console.log("First user",socket.user)
    if (gameList.includes(data.code)) {
      socket.user = data.name;
      socket.money = 1500;
      socket.host = false;
      socket.turn = false;

      gameData[data.code].push(socket);
      // console.log("First user again",gameData[data.code])
      //console.log(gameData[data.code])
      callback("Joined Game");
      socket.emit("newPlayer");
      for (var x = 0; x < gameData[data.code].length; x++) {
        gameData[data.code][x].emit("newPlayer");
      }
    } else {
      callback({ error: true });
    }
  });

  socket.on("nextTurn", (data, callback) => {
    var flip = false;
    var sendData = [];
    var found = false;
    console.log("FINDING NEXT TURN");
    for (var x = 0; x < gameData[data.code].length; x++) {
      console.log(gameData[data.code][x].raiser);
      if (gameData[data.code][x].turn && !found) {
        if (gameData[data.code][x].turnCount == null) {
          gameData[data.code][x].turnCount = 0;
        }
        gameData[data.code][x].turnCount++;
        if (x == gameData[data.code].length - 1) {
          found = true;
          gameData[data.code][0].turn = true;
          gameData[data.code][gameData[data.code].length - 1].turn = false;
          if (
            gameData[data.code][0].raiser &&
            gameData[data.code][x].turnCount > 1
          ) {
            flip = true;
          }
        } else {
          found = true;
          gameData[data.code][x].turn = false;
          gameData[data.code][x + 1].turn = true;
          if (gameData[data.code][x + 1].raiser) {
            flip = true;
          }
        }
      }
      //console.log(gameData[data.code][x])
      if (gameData[data.code][x].big && gameData[data.code][x].turnCount <= 1) {
        flip = false; //g
      }
    }
    for (var y = 0; y < gameData[data.code].length; y++) {
      var x = y;
      var temp = {
        name: gameData[data.code][x].user,
        money: gameData[data.code][x].money,
        host: gameData[data.code][x].host,
        cards: gameData[data.code][x].cards,
        pot: gameData[data.code][x].pot,
        turn: gameData[data.code][x].turn,
        board: gameData[data.code][x].board,
        currentBet: gameData[data.code][x].currentBet,
        raiser: gameData[data.code][x].raiser,
        localBet: gameData[data.code][x].localBet,
      };
      console.log(temp);
      sendData.push(temp);
    }
    socket.emit("changeTurn", sendData);
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].emit("changeTurn", sendData);
    }

    console.log(flip);

    if (flip) {
      if (gameData[data.code][0].flipCount == undefined) {
        gameData[data.code][0].flipCount = 0;
      }
      gameData[data.code][0].flipCount++;

      for (var x = 0; x < gameData[data.code].length; x++) {
        console.log(x);
        gameData[data.code][x].emit("flip", sendData);
      }
    } else {
      if (gameData[data.code][0].flipCount == 3) {
        endGame(data, socket);
        return;
      }
      callback(sendData);
    }
  });

  socket.on("getPlayerInfo", (data, callback) => {
    //console.log("req",cards.draw())

    var sendData = [];
    //console.log(gameData[data.code])
    for (var x = 0; x < gameData[data.code].length; x++) {
      //console.log(gameData[data.code][x])
      var temp = {
        name: gameData[data.code][x].user,
        money: gameData[data.code][x].money,
        host: gameData[data.code][x].host,
        cards: gameData[data.code][x].cards,
        pot: gameData[data.code][x].pot,
        turn: gameData[data.code][x].turn,
        board: gameData[data.code][x].board,
        currentBet: gameData[data.code][x].currentBet,
        raiser: gameData[data.code][x].raiser,
        localBet: gameData[data.code][x].localBet,
      };
      sendData.push(temp);
    }
    callback(sendData);
  });

  socket.on("makeDeck", (callback) => {
    //console.log("req",cards.draw())

    callback("Deck Created");
  });
  socket.on("draw", (callback) => {
    //console.log("req",cards.draw())

    callback(socket.deck.draw());
  });
  socket.on("setBlinds", (data, callback) => {
    for (var x = 0; x < gameData[data.code].length; x++) {
      if (gameData[data.code][x].big) {
        if (x == gameData[data.code].length - 1) {
          gameData[data.code][0].big = true;
          gameData[data.code][0].localBet = 300;
          gameData[data.code][0].money -= 300;
          gameData[data.code][0].raiser = true;
          gameData[data.code][1].small = true;
          gameData[data.code][1].localBet = 200;
          gameData[data.code][1].money -= 200;
        } else {
          gameData[data.code][x + 1].big = true;
          gameData[data.code][x + 1].localBet = 300;
          gameData[data.code][x + 1].raiser = true;

          gameData[data.code][x + 1].money -= 300;
          if (x + 1 == gameData[data.code].length - 1) {
            gameData[data.code][0].small = true;
            gameData[data.code][0].localBet = 200;
            gameData[data.code][0].money -= 200;
          } else {
            gameData[data.code][x + 2].small = true;
            gameData[data.code][x + 2].localBet = 200;
            gameData[data.code][x + 2].localBet -= 200;
          }
        }
      }
    }
    callback("Blinds set");
  });
  socket.on("hands", (data, callback) => {
    if (gameData[data.code].length > 2) {
      gameData[data.code][0].turn = false;
      gameData[data.code][2].turn = true;
    }
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].localBet = 0;
    }
    gameData[data.code][0].big = true;
    gameData[data.code][1].small = true;
    //console.log("req",cards.draw())
    var hands = deal(gameData[data.code].length, socket.deck);
    var board = mainBoard(socket.deck);
    gameData[data.code][0].pot = 0;
    gameData[data.code][0].currentBet = 300;
    gameData[data.code][0].localBet = 300;
    gameData[data.code][0].pot += 300;
    gameData[data.code][0].raiser = true;

    gameData[data.code][0].money -= 300;
    gameData[data.code][1].money -= 200;
    gameData[data.code][1].localBet = 200;
    var send = [];

    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].cards = hands[x];
      gameData[data.code][x].board = board;
      var userData = {
        name: gameData[data.code][x].user,
        money: gameData[data.code][x].money,
        host: gameData[data.code][x].host,
        cards: gameData[data.code][x].cards,
        pot: gameData[data.code][x].pot,
        turn: gameData[data.code][x].turn,
        board: gameData[data.code][x].board,
        currentBet: gameData[data.code][x].currentBet,
        raiser: gameData[data.code][x].raiser,
        localBet: gameData[data.code][x].localBet,
      };
      send.push(userData);
    }
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].emit("gameStarted", userData);
    }
    callback(send);
  });

  socket.on("end", (data) => {
    endGame(data, socket);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
