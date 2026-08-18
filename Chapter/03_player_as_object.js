const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let debugEditor = document.getElementById("console");


// --------------------
// Player
// --------------------

const player = {
    x: 100,
    y: 100,

    width: 50,
    height: 100,

    speed: 300
}


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

    let directionX = 0;
    let directionY = 0;

    if (keys["ArrowRight"] || keys["d"]) {
        directionX += 1;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        directionX -= 1;
    }

    if (keys["ArrowUp"] || keys["w"]) {
        directionY -= 1;
    }

    if (keys["ArrowDown"] || keys["s"]) {
        directionY += 1;
    }

    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    if (length > 0) {
        directionX /= length;
        directionY /= length;
    }

    const velocityX = directionX * player.speed;
    const velocityY = directionY * player.speed;

    player.x += velocityX * deltaTime;
    player.y += velocityY * deltaTime;

    player.x = clamp(player.x, 0, canvas.width - player.width);
    player.y = clamp(player.y, 0, canvas.height - player.height);

    debugEditor.innerHTML =
        "X: " + player.x.toFixed(2) +
        "<br>" +
        "Y: " + player.y.toFixed(2);
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
        player.x,
        player.y,
        player.width,
        player.height
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