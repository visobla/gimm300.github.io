var Deck = require("./Deck");

var _ = require("lodash"); //require "lodash"
const express = require("express");
const app = express();
const http = require("http");
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
    var sendData = [];
    var found = false;
    console.log("FINDING NEXT TURN");
    for (var x = 0; x < gameData[data.code].length; x++) {
      console.log(gameData[data.code]);
      if (gameData[data.code][x].turn && !found) {
        if (x == gameData[data.code].length - 1) {
          found = true;
          gameData[data.code][0].turn = true;
          gameData[data.code][gameData[data.code].length - 1].turn = false;
        } else {
          found = true;
          gameData[data.code][x].turn = false;
          gameData[data.code][x + 1].turn = true;
        }
      }
      //console.log(gameData[data.code][x])
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
      };
      console.log(temp);
      sendData.push(temp);
    }
    socket.emit("changeTurn", sendData);
    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].emit("changeTurn", sendData);
    }
    callback(sendData);
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
  socket.on("hands", (data, callback) => {
    //console.log("req",cards.draw())
    var hands = deal(gameData[data.code].length, socket.deck);
    var board = mainBoard(socket.deck);
    var send = [];

    for (var x = 0; x < gameData[data.code].length; x++) {
      gameData[data.code][x].cards = hands[x];
      gameData[data.code][x].board = board;
      var userData = {
        name: gameData[data.code][x].user,
        money: gameData[data.code][x].money,
        host: gameData[data.code][x].host,
        cards: gameData[data.code][x].cards,
        board: gameData[data.code][x].board,
      };
      send.push(userData);
    }

    callback(send);
  });

  socket.on("end", (data) => {
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
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
