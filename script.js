const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");

let currentPlayer;
let gameGrid;
const winningPositions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Initialize game
function initGame(){
    currentPlayer = "X"; // Human starts
    gameGrid = ["","","","","","","","",""];
    boxes.forEach((box, index)=>{
        box.innerText = "";
        boxes[index].style.pointerEvents = "all";
        box.classList = `box box${index+1}`;
    });
    newGameBtn.classList.remove("active");
    gameInfo.innerText = "Your Turn";
}

initGame();

// Check for win or tie
function checkGameOver(){
    let winner = "";

    winningPositions.forEach((position)=>{
        if((gameGrid[position[0]]!== "" && gameGrid[position[1]]!== "" && gameGrid[position[2]]!== "") &&
           (gameGrid[position[0]]=== gameGrid[position[1]] && gameGrid[position[1]]=== gameGrid[position[2]])){
            
            winner = gameGrid[position[0]];
            boxes.forEach(box=> box.style.pointerEvents = "none");
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });

    if(winner !== ""){
        if(winner === "X"){
            gameInfo.innerText = "You Win!";
        } else {
            gameInfo.innerText = "Try again..."; // AI wins message
        }
        newGameBtn.classList.add("active");
        return true;
    }

    if(gameGrid.every(box => box !== "")){
        gameInfo.innerText = "Game Tied!";
        newGameBtn.classList.add("active");
        return true;
    }

    return false;
}

// Minimax algorithm for AI
function minimax(grid, player){
    const availSpots = grid.map((v,i) => v === "" ? i : null).filter(v=>v!==null);

    if(isWinner(grid, "O")) return {score: 1};
    if(isWinner(grid, "X")) return {score: -1};
    if(availSpots.length === 0) return {score: 0};

    const moves = [];

    for(let i=0; i<availSpots.length; i++){
        const move = {};
        move.index = availSpots[i];
        grid[availSpots[i]] = player;

        if(player === "O"){
            const result = minimax(grid, "X");
            move.score = result.score;
        } else {
            const result = minimax(grid, "O");
            move.score = result.score;
        }

        grid[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if(player === "O"){
        let bestScore = -Infinity;
        moves.forEach(m => {
            if(m.score > bestScore){
                bestScore = m.score;
                bestMove = m;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(m => {
            if(m.score < bestScore){
                bestScore = m.score;
                bestMove = m;
            }
        });
    }

    return bestMove;
}

// Check if a player has won (used by minimax)
function isWinner(grid, player){
    return winningPositions.some(position =>
        grid[position[0]]===player && grid[position[1]]===player && grid[position[2]]===player
    );
}

// AI move using Minimax
function aiMove(){
    gameInfo.innerText = ""; // hide text while AI moves
    const bestMove = minimax([...gameGrid], "O");
    gameGrid[bestMove.index] = "O";
    boxes[bestMove.index].innerText = "O";
    boxes[bestMove.index].style.pointerEvents = "none";

    if(!checkGameOver()){
        currentPlayer = "X";
        gameInfo.innerText = "Your Turn";
    }
}

// Handle human click
function handleClick(index){
    if(gameGrid[index] === "" && currentPlayer === "X"){
        boxes[index].innerText = "X";
        gameGrid[index] = "X";
        boxes[index].style.pointerEvents = "none";

        if(!checkGameOver()){
            currentPlayer = "O";
            setTimeout(aiMove, 300); // AI moves after 0.3 sec
        }
    }
}

// Event listeners
boxes.forEach((box, index)=>{
    box.addEventListener("click", ()=> handleClick(index));
});
newGameBtn.addEventListener("click", initGame);
