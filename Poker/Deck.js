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
                var number;
                if(y==1){
                    number="Ace"
                }
                else if(y==11){
                    number="Jack"
                }
                else if(y==12){
                    number="Queen"
                }
                else if(y==13){
                    number="King"
                }
                else{number=y}
                var temp={
                    suit:suit,
                    number:number
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

    listDeck(){
        return this.cards
    }

    checkMatch(cards){
        if(this.royalFlush(cards)){
            return "Royal Flush";
        }
        else if(this.straightFlush(cards)){
            return "Straight Flush";
        }
        else if(this.fourOfAKind(cards)){
            return "4 of a kind";
        }
        else if(this.fullHouse(cards)){
            return "Full House";
        }
        else if(this.flush(cards)){
            return "Flush";
        }
        else if(this.straight(cards)){
            return "Straight";
        }
        else if(this.threeOfAKind(cards)){
            return "Three of a Kind";
        }
        else if(this.twoPair(cards)){
            return "Two Pair";
        }
        else if(this.pair(cards)){
            return "Pair";
        }
        return "High Card";
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
        var suit;
        var wrong=0;
        
        for(var x = 0; x<cards.length;x++){
            
            if(suit==undefined){
                suit=cards[x].suit
            }else{
                if(suit!=cards[x].suit){
                    wrong++;

                    if(wrong>2){
                       // console.log(x)
                    return false}
                }
            }
            if(suit==cards[x].suit){
                var numTemp;
            if(cards[x].number=="Ace"){
                numTemp=1
            }
            else if(cards[x].number=="King"){
                numTemp=13
            }
            else if(cards[x].number=="Queen"){
                numTemp=12
            }
            else if(cards[x].number=="Jack"){
                numTemp=11
            }
            else{
                numTemp=cards[x].number
            }
            temp.push(numTemp)
            //console.log(temp)
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
        
        for(var x = 0; x<orderedCards.length; x++){
            //console.log(orderedCards[x+1]!=1&&orderedCards[x]!=undefined)
            //console.log(orderedCards[x]+1!=orderedCards[x+1]&&orderedCards[x]!=undefined)
            if(orderedCards[x]==13){
                if(orderedCards[x+1]!=1&&orderedCards[x+1]!=undefined){
                    console.log(x)
                    return false
                }
            }
            else if(orderedCards[x]+1!=orderedCards[x+1]&&orderedCards[x+1]!=undefined){
                console.log(x)
                return false
            }
        }

       if(left.length==0&&right.length==0){
         //  console.log("temp",temp)
       }
      // console.log("left",left+","+right);
       return true;
    }
    fourOfAKind(cards){
       // console.log(cards)
        var same = 0;
        for(var x = 1; x<14;x++){
            same=0;
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    same++
                }
            }
            if(same>=4){
                break
            }
           
        }
        
        return same>=4;
        


    }
    fullHouse(cards){
        var three;
        var two;
        for(var x = 1; x<14;x++){
           three=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    three++
                }
            }
            if(three==3){
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
                break;
            }
           
        }
        return(two==2&&three==3)

    }
    flush(cards){
        var suit;
        var wrong=0;
        for(var x=1;x<cards.length;x++){
        if(suit==undefined){
            suit=cards[x].suit
        }else{
            if(suit!=cards[x].suit){
                wrong++
                if(wrong>2){
                    //console.log(x)
                return false}
            }
        }}
        return true;
    }

    straight(cards){
        var temp=[]
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
        
        for(var x = 0; x<orderedCards.length; x++){
            //console.log(orderedCards[x+1]!=1&&orderedCards[x]!=undefined)
            //console.log(orderedCards[x]+1!=orderedCards[x+1]&&orderedCards[x]!=undefined)
            if(orderedCards[x]==13){
                if(orderedCards[x+1]!=1&&orderedCards[x+1]!=undefined){
                    console.log(x)
                    return false
                }
            }
            else if(orderedCards[x]+1!=orderedCards[x+1]&&orderedCards[x+1]!=undefined){
                console.log(x)
                return false
            }
        }
        return true;
    }
    threeOfAKind(cards){
        var three;
        for(var x = 1; x<14;x++){
            three=0
             for(var y =0;y<cards.length;y++){
                 if(x==cards[y].number){
                     three++
                 }
             }
             if(three==3){
                 return true
             }
            
         }
         return false;
    }
    twoPair(cards){
        var two = 0;
        var pair = 0;

        for(var x = 1; x<14;x++){
            two=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    two++
                }
            }
            if(two==2){
                pair++
            }
            if(pair==2){
                return true;
            }
           
        }
        return false;
    }
    pair(cards){

        var two = 0;
       

        for(var x = 1; x<14;x++){
            two=0
            for(var y =0;y<cards.length;y++){
                if(x==cards[y].number){
                    two++
                }
            }
            if(two==2){
               return true;
            }

           
        }
        return false;

    }
}
module.exports = Deck