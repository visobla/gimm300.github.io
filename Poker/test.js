var Deck = require("./Deck")
var cards = new Deck();
cards.shuffleDeck()
var deckOfCards = cards.listDeck()
var hand = [deckOfCards[0],deckOfCards[1],deckOfCards[2],deckOfCards[3],deckOfCards[4],deckOfCards[5],deckOfCards[6]]

var testHand=[{
    number:12,
    suit:"Clubs"
},{
    number:7,
    suit:"Spades"
},{
    number:1,
    suit:"Clubs"
},{
    number:4,
    suit:"Hearts"
},{
    number:3,
    suit:"Diamonds"
},{
    number:6,
    suit:"Spades"
},{
    number:5,
    suit:"Hearts"
}]




console.log(cards.checkMatch(testHand))