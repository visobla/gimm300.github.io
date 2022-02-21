const _ = require("lodash");
const PokerEvaluator = require("poker-evaluator");

class Deck{
    constructor(){
        this.cards=[];
        this.createDeck();
       
    }
    createDeck(){
        for(var x = 0; x<4;x++){
            var suit;
            if(x==0){
                suit="Hearts"
            }
            else if(x==1){
                suit="Diamonds"
            }
            else if(x==2){
                suit="Clubs"
            }
            else {
                suit="Spades"
            }
            for(var y=1; y<14;y++){

                var temp={
                    suit:suit,
                    number:y
                }
                this.cards.push(temp)
            }
        }
    }

    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    draw(){
        if(this.cards.length>0){
        var temp = this.cards[0]
        this.cards.shift()
        return temp}
        else{return "Deck empty"}
    }

    listDeck(){
        return this.cards
    }

    checkMatch(cards){
        if(this.royalFlush(cards)){
            return {rank:10,highCard:13};
        }
        else if(this.straightFlush(cards)){
            return this.straightFlush(cards);
        }
        else if(this.fourOfAKind(cards)){
            return this.fourOfAKind(cards);
        }
        else if(this.fullHouse(cards)){
            return this.fullHouse(cards);
        }
        else if(this.flush(cards)){
            return this.flush(cards);
        }
        else if(this.straight(cards)){
            return this.straight(cards);
        }
        else if(this.threeOfAKind(cards)){
            return this.threeOfAKind(cards);
        }
        else if(this.twoPair(cards)){
            return this.twoPair(cards);
        }
        else if(this.pair(cards)){
            return this.pair(cards);
        }
        return this.highCard(cards);
    }
    royalFlush(cards){
        var control = [1,13,12,11,10
        ]
        var suit;
        var wrong = 0;
            for(var x = 0; x<cards.length;x++){
                if(suit==undefined){
                    suit=cards[x].suit
                }else{
                    if(suit!=cards[x].suit){
                        wrong++
                        if(wrong>2){
                            //console.log(x)
                        return false}
                    }
                }
                console.log(!control.includes(cards[x].number))
                if(suit==cards[x].suit){
                if(!control.includes(cards[x].number)){
                    wrong++
                    if(wrong>2){
                        console.log(x)
                    return false}
                }}
            }
            
            return true;
    }
    straightFlush(cards){
        var temp = []
        var suits={
            Hearts:0,
            Diamonds:0,
            Clubs:0,
            Spades:0
        };
        var wrong=0;
        var ret = {rank:0,highCard:0}
        for(var x=0;x<cards.length;x++){
            if(cards[x].suit=="Hearts"){
                suits.Hearts++;
            }
            else if(cards[x].suit=="Diamonds"){
                suits.Diamonds++
            }
            else if(cards[x].suit=="Clubs"){
                suits.Clubs++
            }
            else if(cards[x].suit=="Spades"){
                suits.Spades++
            }

        }
        if(suits.Hearts<5&&suits.Diamonds<5&&suits.Clubs<5&&suits.Spades<5){
            return false;
        }
        var maxKey = _.maxBy(_.keys(suits), function (o) { return suits[o]; });
        for(var x = 0; x<cards.length;x++){
            if(cards[x].suit==maxKey){
                temp.push(cards[x].number)
            }
        }
        temp.sort((a,b)=>a-b)
        //console.log(temp)
        var left=[];
        var right=[];
        for(var a = 0; a<temp.length;a++){
           // console.log(temp[a],temp[a+1])
            if(temp[a]+1!=temp[a+1]&&temp[a+1]!=undefined){
                for(var b = 0; b<a+1;b++){
                  //  console.log(b)
                    right.push(temp[b])
                }
                for(var c = a+1; c<temp.length;c++){
                    
                    left.push(temp[c])
                }
                break;
            }
        }

        var orderedCards = left.concat(right);
        //console.log("ORDERED",orderedCards)
        var evaluate = []
        for(var x = 0; x<cards.length;x++){
            var tempString = ""
            if(cards[x].number==1){
                tempString+="A"
            }
            else if(cards[x].number==13){
                tempString+="K"
            }
            else if(cards[x].number==12){
                tempString+="Q"
            }
            else if(cards[x].number==11){
                tempString+="J"
            }
            else if(cards[x].number==10){
                tempString+="T"
            }
            else{
                tempString+=cards[x].number.toString()
            }

            if(cards[x].suit=="Diamonds"){
                tempString+="d"
            }
            else if(cards[x].suit=="Spades"){
                tempString+="s"
            }
            else if(cards[x].suit=="Hearts"){
                tempString+="h"
            }
            else if(cards[x].suit=="Clubs"){
                tempString+="c"
            }
            evaluate.push(tempString)
        }

       if(left.length==0&&right.length==0){
         //  console.log("temp",temp)
       }
       var fancy = PokerEvaluator.evalHand(evaluate)
      // console.log("left",left+","+right);
      ret.rank=9;
      ret.highCard=10
      return fancy.handName=="straight flush"?ret:false;
    }
    fourOfAKind(cards){
       // console.log(cards)
       var ret = {rank:8,highCard:0}
        var same = 0;
        for(var x = 1; x<14;x++){
            same=0;
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    same++
                }
            }
            if(same>=4){
                ret.highCard=x;
                break
            }
           
        }
        
        return same>=4?ret:false;
        


    }
    fullHouse(cards){
        var three;
        var two;
        var high = []
        var ret = {rank:7,highCard:0}
        for(var x = 1; x<14;x++){
           three=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    three++
                    
                }
            }
            if(three==3){
                high.push(x)
                break;
            }
           
        }
        for(var x = 1; x<14;x++){
            two=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    two++
                }
            }
            if(two==2){
                high.push(x)
                break;
            }
           
        }
        ret.highCard=Math.max(...high)
        return(two==2&&three==3)?ret:false

    }
    flush(cards){
        var suits={
            Hearts:0,
            Diamonds:0,
            Clubs:0,
            Spades:0
        };
        var wrong=0;
        var numbers=[];
        var ret = {rank:6,highCard:0}
        console.log(cards)
        
        for(var x=0;x<cards.length;x++){
            if(cards[x].suit=="Hearts"){
                suits.Hearts++;
            }
            else if(cards[x].suit=="Diamonds"){
                suits.Diamonds++
            }
            else if(cards[x].suit=="Clubs"){
                suits.Clubs++
            }
            else if(cards[x].suit=="Spades"){
                suits.Spades++
            }

        }
        if(suits.Hearts<5&&suits.Diamonds<5&&suits.Clubs<5&&suits.Spades<5){
            return false;
        }
        var maxKey = _.maxBy(_.keys(suits), function (o) { return suits[o]; });
        for(var x = 0; x<cards.length;x++){
            if(cards[x].suit==maxKey){
                numbers.push(cards[x].number)
            }
        }
        ret.highCard=Math.max(...numbers)
        return ret;
    }

    straight(cards){
        var ret = {rank:5,highCard:0}
        var temp=[]
        var correct=0;
        var rightNumbers=[]
        var correctBool=true;
        var wrong = 0;
        for(var x=0;x<cards.length;x++){
            temp.push(cards[x].number)
        }
        temp.sort((a,b)=>a-b)
        temp = new Set(temp)
        temp=Array.from(temp)
        console.log(temp)
        var left=[];
        var right=[];
        for(var a = 0; a<temp.length;a++){
            console.log(temp[a],temp[a+1])

            if(temp[a]+1!=temp[a+1]&&temp[a+1]!=undefined){
                for(var b = 0; b<a+1;b++){
                  //  console.log(b)
                    right.push(temp[b])
                }
                for(var c = a+1; c<temp.length;c++){
                    
                    left.push(temp[c])
                }
                break;
            }
        }

        var orderedCards = left.concat(right);
        //console.log("ORDERED",orderedCards)
        if(orderedCards.length<5){
            return false
        }
        var evaluate = []
        for(var x = 0; x<cards.length;x++){
            var tempString = ""
            if(cards[x].number==1){
                tempString+="A"
            }
            else if(cards[x].number==13){
                tempString+="K"
            }
            else if(cards[x].number==12){
                tempString+="Q"
            }
            else if(cards[x].number==11){
                tempString+="J"
            }
            else if(cards[x].number==10){
                tempString+="T"
            }
            else{
                tempString+=cards[x].number.toString()
            }

            if(cards[x].suit=="Diamonds"){
                tempString+="d"
            }
            else if(cards[x].suit=="Spades"){
                tempString+="s"
            }
            else if(cards[x].suit=="Hearts"){
                tempString+="h"
            }
            else if(cards[x].suit=="Clubs"){
                tempString+="c"
            }
            evaluate.push(tempString)
        }

        var fancy = PokerEvaluator.evalHand(evaluate)
    
        ret.highCard=10
        return fancy.handName=="straight"?ret:false;
    }
    threeOfAKind(cards){
        var three;
        var ret = {rank:4,highCard:0}
        for(var x = 1; x<14;x++){
            three=0
             for(var y =0;y<cards.length;y++){
                 if(x==cards[y].number){
                     three++
                 }
             }
             if(three==3){
                 ret.highCard=x
                 return ret
             }
            
         }
         return false;
    }
    twoPair(cards){
        var two = 0;
        var pair = 0;
        var ret = {rank:3,highCard:0}
        var numbers=[]
        for(var x = 1; x<14;x++){
            two=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    two++
                }
            }
            if(two==2){
                numbers.push(x)
                pair++
            }
            if(pair==2){
                ret.highCard=Math.max(...numbers)
                return ret;
            }
           
        }
        return false;
    }
    pair(cards){
        var ret = {rank:2,highCard:0}
        var two = 0;
       

        for(var x = 1; x<14;x++){
            two=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    two++
                }
            }
            if(two==2){
                ret.highCard=x
               return ret;
            }

           
        }
        return false;

    }
    highCard(cards){
        var ret = {rank:1,highCard:0}
        var nums =[]
        for(var x = 0; x<cards.length;x++){
            nums.push(cards[x].number)
        }
        ret.highCard=Math.max(...nums)
        return ret
    }
}
module.exports = Deck