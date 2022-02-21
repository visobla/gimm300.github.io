var Deck = require("./Deck")
var cards = new Deck;

var testDeck=[
    {suit:"Clubs", number:4},
    {suit:"Clubs", number:6},
    {suit:"Clubs", number:7},
    {suit:"Diamonds", number:12},
    {suit:"Hearts", number:8},
    {suit:"Diamonds", number:13},
    {suit:"Diamonds", number:12},
]
console.log(cards.checkMatch(testDeck))