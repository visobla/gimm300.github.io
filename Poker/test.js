var Deck = require("./Deck")
var cards = new Deck;

var testDeck=[
    {suit:"Clubs", number:4},
    {suit:"Clubs", number:4},
    {suit:"Diamonds", number:5},
    {suit:"Clubs", number:5},
    {suit:"Clubs", number:8},
    {suit:"Diamonds", number:13},
    {suit:"Diamonds", number:12},
]
console.log(cards.checkMatch(testDeck))