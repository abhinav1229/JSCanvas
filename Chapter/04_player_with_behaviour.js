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

    speed: 300,

    update(deltaTime) {

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

        const velocityX = directionX * this.speed;
        const velocityY = directionY * this.speed;

        this.x += velocityX * deltaTime;
        this.y += velocityY * deltaTime;

        this.x = clamp(this.x, 0, canvas.width - this.width);
        this.y = clamp(this.y, 0, canvas.height - this.height);

        debugEditor.innerHTML =
            "X: " + this.x.toFixed(2) +
            "<br>" +
            "Y: " + this.y.toFixed(2);
    },

    draw() {
        ctx.fillStyle = "red";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
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
    player.update(deltaTime);
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

    player.draw(ctx);
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