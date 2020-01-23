/**
 * Global Variables
 */
var aiTeam = 'O';
var board = ['', '', '', '', '', '', '', '', ''];
var cells = [];
var gameContainer = document.getElementById('game-container');
var playerTeam = 'X';
var turns = 0;
var victory = false;

/**
 * Global Functions
 */
function aiTurn() {
    var bestScore = -100;
    var unoccupiedCells = Object.keys(board).filter(function(key){ return board[key] == ''; });
    var bestMove = unoccupiedCells[Math.floor(Math.random() * unoccupiedCells.length)];
    var easyFactor = !!(Math.random() < 0.2);
    
    if(checkTie()) {
        setTimeout(function() { alert('Tie!'); }, 250);
        victory = true;
        return;
    }

    // minimax implementation
    if(!easyFactor) {
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                occupyCell(i, aiTeam);
                let score = minimax(0, -Infinity, Infinity, false);
                unoccupyCell(i);
                if(score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    }

    occupyCell(bestMove, aiTeam);
    turns++;
}

function checkTie() {
    if(board.includes('')) {
        return false;
    }

    return true;
}

function checkVictory(team) {
    var occupiedIndices = [];

    for(var i = 0; i < board.length; i++) {
        if(board[i] == team) {
            occupiedIndices.push(i);
        }
    }

    // specific victory conditions
    var horizontalVictory = (occupiedIndices.includes(0) && occupiedIndices.includes(1) && occupiedIndices.includes(2))
        || (occupiedIndices.includes(3) && occupiedIndices.includes(4) && occupiedIndices.includes(5))
        || (occupiedIndices.includes(6) && occupiedIndices.includes(7) && occupiedIndices.includes(8));
    var verticalVictory = (occupiedIndices.includes(0) && occupiedIndices.includes(3) && occupiedIndices.includes(6))
        || (occupiedIndices.includes(1) && occupiedIndices.includes(4) && occupiedIndices.includes(7))
        || (occupiedIndices.includes(2) && occupiedIndices.includes(5) && occupiedIndices.includes(8));
    var diagonalVictory = (occupiedIndices.includes(0) && occupiedIndices.includes(4) && occupiedIndices.includes(8))
        || (occupiedIndices.includes(2) && occupiedIndices.includes(4) && occupiedIndices.includes(6));

    if(horizontalVictory || verticalVictory || diagonalVictory) {
        return true;
    }

    return false;
}

function click(event) {
    var cell = event.target;

    if(victory) return;

    if(whosTurn() == playerTeam) {
        if(playerTurn(cell)) {
            draw();
            victory = checkVictory(playerTeam);
            if(victory) {
                setTimeout(function(){ alert('Hooray! ' + playerTeam + ' won!'); }, 250);
                return;
            }

            aiTurn();
            draw();
            victory = checkVictory(aiTeam);
            if(victory) {
                setTimeout(function(){ alert('Hooray! ' + aiTeam + ' won!'); }, 250);
                return;
            }
        }
    }
}

function draw() {
    // init if cells is empty
    if(cells.length == 0) {
        for(var i = 0; i < board.length; i++) {
            var elm = document.createElement('div');
            elm.classList.add('cell');
            elm.setAttribute('data-index', i);
            elm.innerHTML = board[i];
            gameContainer.appendChild(elm);
            cells.push(elm);
        }
    }
    
    // fill each cell with the corresponding contents in board
    for(var i = 0; i < board.length; i++) {
        var elm = cells[i];
        elm.innerHTML = board[i];
        if(board[i] != '') 
            elm.classList.add('occupied');
    }
}

function minimax(depth, alpha, beta, isMax) {
    var score = {
        X: -10,
        O: 10,
        tie: 0
    };

    if(checkVictory(playerTeam)) {
        // console.log('minimax(' + depth + '): ' + score[playerTeam]);
        return score[playerTeam];
    }
    else if(checkVictory(aiTeam)){
        // console.log('minimax(' + depth + '): ' + score[aiTeam]);
        return score[aiTeam];
    }
    else if(checkTie())
        return score.tie;

    // maximizing
    if(isMax) {
        let bestScore = -Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                occupyCell(i, aiTeam);
                let score = minimax(depth++, alpha, beta, false);
                unoccupyCell(i);
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(score, alpha);
                if(beta <= alpha)
                    break;
            }
        }

        return bestScore;
    }
    // minimizing
    else {
        let bestScore = Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                occupyCell(i, playerTeam);
                let score = minimax(depth++, alpha, beta, true);
                unoccupyCell(i);
                bestScore = Math.min(score, bestScore);
                beta = Math.min(score, beta);
                if(beta <= alpha)
                    break;
            }
        }
        
        return bestScore;
    }
}

function occupyCell(cellIndex, team) {
    board[cellIndex] = team;
}

function unoccupyCell(cellIndex) {
    board[cellIndex] = '';
}

function playerTurn(cell) {
    var index = cell.dataset.index;
    if(board[index] == '') {
        occupyCell(index, playerTeam);
        turns++;
        return true;
    }

    return false;
}

function whosTurn() {
    return turns % 2 == 0 ? playerTeam : aiTeam;
}

/**
 * Start
 */
window.addEventListener('load', function(e){
    draw();
    for(var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.addEventListener('click', function(event){
            click(event);
        });
    }
});