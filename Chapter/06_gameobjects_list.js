const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let debugEditor = document.getElementById("console");


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

class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        ctx.fillStyle = "white";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 100);

        this.speed = 300;
    }

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
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 50);
        this.speed = 100;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

// --------------------
// Player
// --------------------

const player = new Player(100, 100);
const player1 = new Player(120, 0);
const player2 = new Player(0, 300);
const player3 = new Player(200, 350);

const enemy = new Enemy(700, 250);
const enemy2 = new Enemy(600, 100);
const enemy3 = new Enemy(500, 50);
const enemy4 = new Enemy(700, 0);

const gameObjects = [player, player1, player2, player3, enemy, enemy2, enemy3, enemy4];

// --------------------
// Update
// --------------------
function update(deltaTime) {
    for (const gameObject of gameObjects) {
        gameObject.update(deltaTime);
    }
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

    for (const gameObject of gameObjects) {
        gameObject.draw(ctx);
    }
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