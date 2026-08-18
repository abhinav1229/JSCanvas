const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let debugEditor = document.getElementById("console");


// --------------------
// Player
// --------------------

let playerX = 100;
let playerY = 100;

const playerWidth = 50;
const playerHeight = 100;

const playerSpeed = 300;


// --------------------
// Input
// --------------------

const keys = {};

window.addEventListener("keydown", function (event) {
    keys[event.key] = true;
});

window.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});


// --------------------
// Update
// --------------------

function update(deltaTime) {

    if (keys["ArrowRight"]) {
        playerX += playerSpeed * deltaTime;
    }

    if (keys["ArrowLeft"]) {
        playerX -= playerSpeed * deltaTime;
    }

    if (keys["ArrowUp"]) {
        playerY -= playerSpeed * deltaTime;
    }

    if (keys["ArrowDown"]) {
        playerY += playerSpeed * deltaTime;
    }

    playerX = clamp(playerX, 0, canvas.width - playerWidth);
    playerY = clamp(playerY, 0, canvas.height - playerHeight);

    console.innerHTML = "X: " + playerX.toFixed(2) + "<br>" + "Y: " + playerY.toFixed(2);
}


// --------------------
// Draw
// --------------------

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "red";

    ctx.fillRect(
        playerX,
        playerY,
        playerWidth,
        playerHeight
    );
}


// --------------------
// Game Loop
// --------------------
let lastTime = null;
function gameLoop(timestamp) {

    if (lastTime === null) {
        lastTime = timestamp;
    }

    const deltaTime = (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

/* Math Methods */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

gameLoop();