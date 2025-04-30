// Game constants
let inputDir = { x: 0, y: 0 };
let speed = 5;
let lastPaintTime = 0;
let snakearr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let board = document.querySelector(".board");
let score = 0;
let bgStarted = false;

// Sound files
let bgMusic = new Audio('bg.mp3');
let foodSound = new Audio('food.mp3');
let gameOverSound = new Audio('win.mp3');

// Game loop
function main(ctime) {
    window.requestAnimationFrame(main);

    if (!bgStarted) {
        bgMusic.loop = true;
        bgMusic.play();
        bgStarted = true;
    }

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameengine();
}

function isCollide(sarr) {
    // Bump into itself
    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) return true;
    }
    // Bump into wall
    if (
        sarr[0].x <= 0 || sarr[0].x >= 18 ||
        sarr[0].y <= 0 || sarr[0].y >= 18
    ) {
        return true;
    }
    return false;
}

function gameengine() {
    // Collision detection
    if (isCollide(snakearr)) {
        inputDir = { x: 0, y: 0 };
        bgMusic.pause();
        bgMusic.currentTime = 0;
        gameOverSound.play();
        alert("Game over! Press any key to play again.");
        snakearr = [{ x: 13, y: 15 }];
        score = 0;
        bgStarted = false; // So it restarts on next play
    }

    // Food eaten
    if (snakearr[0].x === food.x && snakearr[0].y === food.y) {
        foodSound.play();
        snakearr.unshift({ x: snakearr[0].x + inputDir.x, y: snakearr[0].y + inputDir.y });
        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Move the snake
    for (let i = snakearr.length - 2; i >= 0; i--) {
        snakearr[i + 1] = { ...snakearr[i] };
    }

    snakearr[0].x += inputDir.x;
    snakearr[0].y += inputDir.y;

    // Render snake
    board.innerHTML = "";
    snakearr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Render food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Start the game
window.requestAnimationFrame(main);

// Handle keyboard input
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
        default:
            break;
    }
});
