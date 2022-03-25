var code;
var name;
var currentBet;
var flipNumber = 0;
//Connects to server
var socket = io("https://pokergimm.herokuapp.com/");
//Creates listener for when a new player joins, the server will send this out
socket.on("newPlayer", () => {
  var send = { code: code };
  console.log(send);
  //Client requests all info from the player and processes
  socket.emit("getPlayerInfo", send, (response) => {
    var div = document.getElementById("names");

    div.innerHTML = "";
    // console.log(response);
    var container = document.createElement("div");
    var board = document.getElementById("board");
    board.innerText = JSON.stringify(response[0].board);

    for (var x = 0; x < response.length; x++) {
      var nameFile = document.createElement("h2");
      var pot = document.getElementById("potAmount");
      var current = document.getElementById("current");
      var match = document.getElementById("match");
      console.log("POT", response[x].pot);
      if (response[x].pot == undefined && response[x].host) {
        pot.innerText = "Pot: " + "0";
      } else if (response[x].pot != undefined && response[x].host) {
        pot.innerText = "Pot: " + response[x].pot;
      }

      current.innerText = "Current bet: " + response[0].currentBet;
      var check = document.getElementById("check");
      // console.log("INITIAL", document.getElementById("bet"));
      nameFile.innerText = response[x].name;
      if (document.getElementById("bet") == null) {
        var bet = document.createElement("button");
        bet.id = "bet";
      }
      if (document.getElementById("fold") == null) {
        var fold = document.createElement("button");
        fold.id = "fold";
      }
      if (document.getElementById("check") == null) {
        check = document.createElement("button");
        check.innerText = "Check";
        check.id = "check";
      }

      check.onclick = function () {
        var check = document.getElementById("check");
        check.disabled = true;
        socket.emit("refresh", send, (res) => {
          socket.emit("nextTurn", send, (res) => {
            console.log("flip check", res);
            return;
          });
        });
      };
      var betAmount = document.createElement("input");
      fold.onclick = function fold() {
        // console.log("CLICK");
        var localBet = document.getElementById("amount");
        var send = { bet: localBet.value, code: code };

        socket.emit("fold", send, (response) => {
          //  console.log(response);
          socket.emit("refresh", send, (res) => {
            socket.emit("nextTurn", send, (res) => {
              console.log("flip check", res);
            });
          });
        });
      };

      betAmount.id = "amount";
      //Processes bet and updates the server, refreshes server which updates all the clients, and then asks the server to update the turn order
      bet.onclick = function bet() {
        var locBet = document.getElementById("bet");
        if (locBet.innerText == "Check") {
          socket.emit("refresh", send, (res) => {
            socket.emit("nextTurn", send, (res) => {
              console.log("flip check", res);

              return;
            });
          });
        }
        // console.log("CLICK");
        var localBet = document.getElementById("amount");
        var send = { bet: localBet.value, code: code };
        socket.on("flip", (data) => {
          flipNumber++;
          console.log("FLIPCOUNT");
        });
        socket.emit("bet", send, (response) => {
          //console.log(response);
          //console.log(response.error);
          if (response.error) {
            alert("You must enter a bet more than the current bet");
            return;
          }
          //console.log(response);
          socket.emit("refresh", send, (res) => {
            socket.emit("nextTurn", send, (res) => {
              console.log("flip check", res);
            });
          });
        });
      };
      console.log(response[x].localBet, response[0].currentBet);

      bet.innerText = "Bet";

      fold.innerText = "Fold";

      //console.log(response[x].name.toString(), name);
      if (response[x].name.toString() == name) {
        console.log(check);

        console.log(response);
        console.log(response[0].currentBet - response[x].localBet);
        match.innerHTML =
          response[0].currentBet - response[x].localBet + " to match";
        nameFile.appendChild(bet);
        nameFile.appendChild(betAmount);
        nameFile.appendChild(fold);
        nameFile.appendChild(check);
      }

      var money = document.createElement("h2");
      money.innerText = response[x].money;
      if (response[x].cards != undefined) {
        var cards = document.createElement("p");
        cards.innerText = JSON.stringify(response[x].cards);
        container.appendChild(cards);
      }
      container.appendChild(nameFile);
      container.appendChild(money);
    }

    div.appendChild(container);
    var data = response;
    // console.log("New", data);
    var bet = document.getElementById("bet");
    var fold = document.getElementById("fold");
    var check = document.getElementById("check");
    check.innerText = "Check";
    check.id = "check";
    check.disabled = true;
    bet.disabled = true;
    fold.disabled = true;
    //console.log(fold);
    // console.log(bet);
    // console.log("gothere");
    //Each client determines which players turn it is based off the server info
    for (var y = 0; y < data.length; y++) {
      // console.log(data[y].turn);
      if (name == data[y].name && data[y].turn) {
        // console.log("ACTIVATE");
        bet.disabled = false;
        fold.disabled = false;
        console.log(
          "CHECK CHANGE",
          response[y].localBet >= response[0].currentBet
        );
        if (response[y].localBet >= response[0].currentBet) {
          check.disabled = false;
        }
      }
    }
  });
});
//Listens for turn change, and updates personal client
socket.on("changeTurn", (data) => {
  // console.log("New", data);
  var bet = document.getElementById("bet");
  var fold = document.getElementById("fold");
  var check = document.getElementById("check");
  check.innerText = "Check";
  check.id = "check";
  check.disabled = true;
  bet.disabled = true;
  fold.disabled = true;
  //console.log(fold);
  // console.log(bet);
  // console.log("gothere");
  //Each client determines which players turn it is based off the server info
  for (var y = 0; y < data.length; y++) {
    // console.log(data[y].turn);
    if (name == data[y].name && data[y].turn) {
      // console.log("ACTIVATE");
      bet.disabled = false;
      fold.disabled = false;
      console.log("CHECK CHANGE", data[y].localBet >= data[0].currentBet);
      if (data[y].localBet >= data[0].currentBet) {
        check.disabled = false;
      }
    }
  }
});
//Creates deck, test function, not currently used
function go() {
  //console.log("here");
  socket.emit("makeDeck", (res) => {
    // console.log(res);
  });
  //console.log("got");
}
//Draws card. Test function, not currently used
function draw() {
  //console.log("here");
  socket.emit("draw", (res) => {
    // console.log(res);
  });
  // console.log("got");
}
//Tells server to create lobby and deck. Attatches deck to host socket
function create() {
  name = document.getElementById("name").value;
  var send = { name: document.getElementById("name").value };
  // console.log("here");
  socket.emit("createGame", send, (res) => {
    //  console.log(res);
    code = res;
  });
  //console.log("got");
}
//Gives code to server for it to check if valid, if it is it joins the game
function join() {
  name = document.getElementById("name").value;
  //console.log("here");
  code = document.getElementById("gameCode").value;
  var send = {
    code: document.getElementById("gameCode").value,
    name: document.getElementById("name").value,
  };
  // console.log(send);
  socket.emit("joinLobby", send, (res) => {
    // console.log(send);
    if (res.error) {
      alert("Game not found");
      return;
    }
    socket.emit("getPlayerInfo", send, (response) => {
      //  console.log(response);
    });
  });
  //console.log("got");
}
//Tells the server to start the game, draws each players cards, as well as the middle card. Turn card processing to be done on front end
function startGame() {
  var send = { code: code };
  socket.emit("hands", send, (response) => {
    // console.log(response);

    socket.emit("refresh", send, (res) => {});
  });
}
//Ends the game, right now is button, should be done automatically on last turn
function endGame() {
  var send = { code: code };
  socket.emit("end", send);
}
