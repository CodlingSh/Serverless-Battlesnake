exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const mySnake = body.you;
        const gameBoard = drawBoard(body.board, mySnake);
        let possibleMoves = ["up", "down", "left", "right"];

        possibleMoves = avoidWalls(mySnake, possibleMoves, body.board);
        possibleMoves = avoidObstacles(mySnake, possibleMoves, gameBoard);
        // const game = JSON.parse(event.body.game);
        // const turn = JSON.parse(event.body.game);
        // const board = JSON.parse(event.body.game);
        // const you = JSON.parse(event.body.you);
        humanReadableBoard(gameBoard, mySnake);
        
        // return res({ligma: "balls"});

        console.log(possibleMoves);
        return res({move: possibleMoves[Math.floor(Math.random() * possibleMoves.length)]});
    } catch (error) {
        return res({ error }, 500)
    }
}

const drawBoard = (boardInfo, sharktopus) => {
    let board = [];

    // Draw the initial board
    for (let y = 0; y < boardInfo.height; y++) {
        board.push([]);
        for (let x = 0; x < boardInfo.width; x++) {
            board[y].push("·");
        }
    }

    console.log(boardInfo.snakes[1]["body"][1]["x"]);

    // Draw the food
    for (let i = 0; i < boardInfo.food.length; i++) {
        board[boardInfo.food[i]["y"]][boardInfo.food[i]["x"]] = "f";
    }

    // Draw the hazard
    for (let i = 0; i < boardInfo.hazards.length; i++) {
        board[boardInfo.hazards[i]["y"]][boardInfo.hazards[i]["x"]] = "X";
    }

    // Draw the snakes
    for (let snake = 0; snake < boardInfo.snakes.length; snake++) {
        for (let bodyPart = 0; bodyPart < boardInfo.snakes[snake]["body"].length; bodyPart++) {
            board[boardInfo.snakes[snake]["body"][bodyPart]["y"]][boardInfo.snakes[snake]["body"][bodyPart]["x"]] = "e";
        }
    }

    // Draw Sharktopus
    for (let i = 0; i < sharktopus.body.length; i++) {
        board[sharktopus.body[i]["y"]][sharktopus.body[i]["x"]] = "S";
    }

    // Add heads
    for (let i = 0; i < boardInfo.snakes.length; i++) {
        board[boardInfo.snakes[i].head["y"]][boardInfo.snakes[i].head["x"]] = "☺"
    }

    return board;
}

const avoidWalls = (sharktopus, possibleMoves, boardInfo) => {
    moves = possibleMoves;

    if (sharktopus.head["x"] == 0) moves = moves.filter(e => e != "left"); 
    if (sharktopus.head["x"] == boardInfo.width) moves = moves.filter(e => e != "right");
    if (sharktopus.head["y"] == 0) moves = moves.filter(e => e != "down"); 
    if (sharktopus.head["y"] == boardInfo.height) moves = moves.filter(e => e != "up");
    
    return moves;
}

const avoidObstacles = (sharktopus, possibleMoves, gameBoard) => {
    let moves = possibleMoves;
    let myHead = sharktopus.head;
    let badSpots = ["h", "S", "x"];

    console.log(myHead);

    // Check for objects above head
    if (moves.includes("up")) {
        if (gameBoard[myHead["y"] + 1][myHead["x"]] == "S") {
            moves = moves.filter(e => e != "up");
        }
    }

    // Check for objects to the right of head
    if (moves.includes("right")) {
        if (badSpots.includes(gameBoard[myHead["y"]][myHead["x"] + 1])) {
            moves = moves.filter(e => e != "right");
        }
    }

    // Check for objects below the head
    if (moves.includes("down")) {
        if (badSpots.includes(gameBoard[myHead["y"] - 1][myHead["x"]])) {
            moves = moves.filter(e => e != "down");
        }
    }

    // Check for obstacles to the left of head
    if (moves.includes("left")) {
        if (badSpots.includes(gameBoard[myHead["y"]][myHead["x"] - 1])) {
            moves = moves.filter(e => e != "left");
        } 
    }

    return moves;
}

function res(o, statusCode = 200) {
    return { statusCode, body: JSON.stringify(o) }
}




/* HELPER FUNCTIONS */
const humanReadableBoard = (boardInfo) => {
    let line;

    for (let y = boardInfo.length - 1; y >= 0; y--) {
        // console.log(y);
        line = "";

        for (let x = 0; x < boardInfo[y].length; x++) {
            line += boardInfo[y][x] + " ";
        }

        console.log(line);
    }
}