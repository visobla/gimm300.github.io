document.addEventListener('DOMContentLoaded', () => {

const cardArray=[

    {
        name: 'gold',
        img: '../Images/violetGold.png'
    },
    {
        name: 'gold',
        img: '../Images/violetGold.png'
    },
    {
        name: 'diamond',
        img: '../Images/violetDiamond.png'
    },
    {
        name: 'diamond',
        img: '../Images/violetDiamond.png'
    },    
    {
        name: 'emerald',
        img: '../Images/violetEmerald.png'
    },
    {
        name: 'emerald',
        img: '../Images/violetEmerald.png'
    },
    {
        name: 'heart',
        img: '../Images/violetHeart.png'
    },
    {
        name: 'heart',
        img: 'Images\violetHeart.png'
    }
]
cardArray.sort(() => 0.5 - Math.random())

const grid = document.querySelector.apply('.grid')
const resultDisplay = document.querySelector('result')
var cardsChosen = []
var cardsChosenId = []
var cardsWon = []

function createBoard(){
    for(let i =0; i < cardArray.length; i++){
        var card = document.createElement('img')
        card.setAttribute('src', '../Images/violetBack.png')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipcard)
        grid.appendChild(card)
    }
}

function checkForMatch(){
    var cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]
    if(cardsChosen[0] === cardsChosen[1]){
        alert('You found a match')
        cards[optionOneId].setAttribute('src', '..Images/violetEmpty.png')
        cards[optionTwoId].setAttribute('src', '..Images/violetEmpty.png')
        cardsWon.push(cardsChosen)
    } else {
        cards[optionOneId].setAttribute('src', '../Images/violetBack.png')
        cards[optionTwoId].setAttribute('src', '../Images/violetBack.png')
        alert('Sorry, try again')    
    }
    var cardsChosen = []
    var cardsChosenId = []
    resultDisplay.textContent = cardsWon.length
    if (cardsWon.length === cardArray.length/2){
        resultDisplay.textContent = 'Congratulations! You found them all!'
    }
}

function flipCard(){
    var cardId = this.getAttribute('data-id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenId.push(cardId)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length ===2){
        setTimeout(checkForMatch, 500)
    }
}

createBoard()

})