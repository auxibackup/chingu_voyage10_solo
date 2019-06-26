const stars = document.querySelector('.stars');
const reset = document.querySelector('#reset');
const time  = document.querySelector('#time');
const grid = document.querySelector('.grid');
const moves = document.querySelector('#moves');
const title = document.querySelector('#title');

let data = [];
let cards = undefined;
let N_CARDS = 16;
let matchCount = 0;
let moveCount = 0;
let selectionA = undefined;
let selectionB = undefined;
let sec = 0;
let min = 0;
let isWinner = true;

const timer = setInterval(function(){
    if(!isWinner){
        sec++;
        if(sec > 59){
            sec = 0;
            min++;
        }
        time.textContent = `${min}:${sec}`;
    }

}, 1000)



const resetGame = () => {
    new_game();
    cards.forEach(card => {
        hideCard(card);
    })
    moveCount = 0;
    matchCount = 0;
    selectionA = undefined;
    selectionB = undefined;
    sec = 0;
    min = 0;
    isWinner = false;

    moves.textContent = moveCount;
    title.textContent = 'Matching Game';
}
const new_game = ()=> {
    grid.innerHTML =''; 
    grid.setAttribute('style', 'background-color: gray');
    data = generateGridData(N_CARDS);
    data = shuffleData(data);
    generateGridElement(data);
}

const showCard = (card) => {
    let idx = card.dataset.idx;
   
    card.style.background = 'white';
    card.style.backgroundImage = `url(https://robohash.org/${data[idx]})`;
    card.style.backgroundSize = '100%';
    card.style.backgroundRepeat='no-repeat'
}
const hideCard = (card) => {
    card.removeAttribute('style')
}
const checkMatch = (data, idxA, idxB) => (data[idxA] === data[idxB])? true : false;

const generateGridData = (MAX) => {
    let data = [];
    for(let i = 0; i < MAX/2; ++i){
        data.push(i);
        data.push(i);
    }
    return data;
}

const generateGridElement = (data) => {
    let MAX = data.length;

    for(let i = 0; i < MAX; ++i){
        let card = document.createElement('span');
        card.setAttribute('class', 'card');
        card.setAttribute('data-idx', i)
        grid.appendChild(card);
    }
    cards = document.querySelectorAll('.card');
}

const getRandNum = (MAX) => {
    return Math.floor(Math.random() *MAX);
}

const shuffleData = (data) => {
    let shuffled = data;
    let MAX = data.length;

    for(let i = 0; i < MAX; ++i){
        let indexA = getRandNum(MAX);
        let indexB = getRandNum(MAX);

        // swap
        [shuffled[indexA], shuffled[indexB]] = 
            [shuffled[indexB], shuffled[indexA]]
    }

    return shuffled;
}



reset.addEventListener('click', (e) => {
    resetGame();
})

grid.addEventListener('click', (e) => {
    if(!isWinner && e.target && e.target.className === 'card'){

        let selectIdx = e.target.dataset.idx;
        let cards = document.querySelectorAll('.card')

        if(selectionA) selectionB = cards[selectIdx];
        else selectionA = cards[selectIdx];

        showCard(cards[selectIdx])

        if(selectionA && selectionB) {
            // console.log(selectionA, selectionB)
            
            if(checkMatch(data, selectionA.dataset.idx, selectionB.dataset.idx)){
                matchCount++;   
                moveCount++;

                selectionA = undefined;
                selectionB = undefined;

                if(matchCount === 8){
                    isWinner = true;
                }
            } else {
                setTimeout(() => {
                hideCard(selectionA);
                hideCard(selectionB);
                moveCount++;

                selectionA = undefined;
                selectionB = undefined;
                }, 250 )
            }
        }
    }
    moves.textContent = `${moveCount} Moves`;

    if(isWinner){
        title.textContent = 'Game Over!'
        grid.innerHTML = '';
        grid.style.background='white';

        let newGameButton = document.createElement('button');
        newGameButton.textContent = `Click to play again!`;
        newGameButton.style.width = '300px';
        newGameButton.style.height = '50px';
        newGameButton.setAttribute('class', 'new-game');

        grid.appendChild(newGameButton);

    }

    if(e.target && e.target.className === 'new-game'){
        resetGame();
    }
})

new_game();