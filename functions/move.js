exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const mySnake = body.you;

        const gameBoard = drawBoard(body.board, mySnake);
        let possibleMoves = ["up", "down", "left", "right"];
        let preferredMoves;

        // Variables to help determine best possible path
        let upMoves;
        let downMoves;
        let leftMoves;
        let rightMoves;
        let mostMoves;

        possibleMoves = avoidWalls(mySnake, possibleMoves, body.board);
        possibleMoves = avoidObstacles(mySnake, possibleMoves, gameBoard);
        // possibleMoves = checkSpaces(mySnake, possibleMoves, gameBoard);
    
        humanReadableBoard(gameBoard, mySnake);
        console.log("gameBoard is a " + typeof(gameBoard));

        /*if (possibleMoves.includes("up")) {
            upMoves = countPath(floodFill(possibleMoves, mySnake.head["y"] + 1, mySnake.head["x"]));
            console.log(upMoves);
        }
        if (possibleMoves.includes("down")) {
            downMoves = countPath(floodFill(possibleMoves, mySnake.head["y"] - 1, mySnake.head["x"]));
            console.log(downMoves);
        }
        if (possibleMoves.includes("left")) {
            leftMoves = countPath(floodFill(possibleMoves, mySnake.head["y"], mySnake.head["x"] + 1));
            console.log(leftMoves);
        }
        if (possibleMoves.includes("right")) {
            rightMoves = countPath(floodFill(possibleMoves, mySnake.head["y"], mySnake.head["x"] - 1));
            console.log(rightMoves);
        }

        console.log(upMoves + " " + downMoves + " " + leftMoves + " " + rightMoves);*/

        return res({move: possibleMoves[Math.floor(Math.random() * possibleMoves.length)]});
    } catch (error) {
        console.log(error);
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

    // console.log(boardInfo.snakes[1]["body"][1]["x"]);

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
    if (sharktopus.head["x"] == boardInfo.width - 1) moves = moves.filter(e => e != "right");
    if (sharktopus.head["y"] == 0) moves = moves.filter(e => e != "down"); 
    if (sharktopus.head["y"] == boardInfo.height - 1) moves = moves.filter(e => e != "up");
    
    return moves;
}

const avoidObstacles = (sharktopus, possibleMoves, gameBoard) => {
    let moves = possibleMoves;
    let myHead = sharktopus.head;
    let badSpots = ["h", "S", "x", "e"];

    console.log(myHead);

    // Check for objects above head
    if (moves.includes("up")) {
        if (badSpots.includes(gameBoard[myHead["y"] + 1][myHead["x"]])) {
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

const floodFill = (gameBoard, sx, sy) => {
    let badSpots = ["h", "S", "x", "e"];
    // gameBoard = gameBoard.list;

    console.log(typeof(gameBoard.list));

    if (!badSpots.includes(gameBoard[sy][sx])) {
        console.log("Can check!")
        /*gameBoard[sy][sx] = "c";

        // Check up
        if (sy < gameBoard.length - 1) {
            floodFill(gameBoard, sx, sy + 1, preferredMoves);
        } 
        // Check right
        if (sx < gameBoard[sy].length - 1) {
            floodFill(gameBoard, sx + 1, sy, preferredMoves);
        }
        // Check down
        if (sy > 0) {
            floodFill(gameBoard, sx, sy - 1, preferredMoves);
        }
        // Check left
        if (sx > 0) {
            floodFill(gameBoard, sx - 1, sy, preferredMoves);
        }*/
    }

    console.log("Made it!");
    return gameBoard;
}

const countPath = (gameBoard) => {
    console.log("TEST!!!");
    let count = 0;

    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            if (gameBoard[y][x] == 6) {
                count++
            }
        }
    }

    return count
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