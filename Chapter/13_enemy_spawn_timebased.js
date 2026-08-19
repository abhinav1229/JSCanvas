const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let debugEditor = document.getElementById("console");


// --------------------
// Input
// --------------------

const keys = {};

window.addEventListener("keydown", function (event) {
    keys[event.code] = true;
});

window.addEventListener("keyup", function (event) {
    keys[event.code] = false;
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

    isColliding(other) {

        const isOverlappingX =
            this.x < other.x + other.width &&
            this.x + this.width > other.x;

        const isOverlappingY =
            this.y < other.y + other.height &&
            this.y + this.height > other.y;

        return isOverlappingX && isOverlappingY;
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 100);

        this.speed = 300;

        this.fireCooldown = 0.2;
        this.fireTimer = 0;
    }

    update(deltaTime) {

        let directionX = 0;
        let directionY = 0;

        if (keys["ArrowRight"] || keys["KeyD"]) {
            directionX += 1;
        }

        if (keys["ArrowLeft"] || keys["KeyA"]) {
            directionX -= 1;
        }

        if (keys["ArrowUp"] || keys["KeyW"]) {
            directionY -= 1;
        }

        if (keys["ArrowDown"] || keys["KeyS"]) {
            directionY += 1;
        }

        if (this.fireTimer > 0) {
            this.fireTimer -= deltaTime;
        }

        if (keys["Space"] && this.fireTimer <= 0) {
            this.shoot();
            this.fireTimer = this.fireCooldown;
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

    shoot() {
        bullets.push(
            new Bullet(
                this.x + this.width, this.y + this.height / 2 - 5 //(5 = bullet.height/2)
            )
        );
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 50);

        this.speed = 100;
        this.health = 3;
        this.isDead = false;

        this.damageCooldown = 0.5;
        this.damageTimer = 0;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;

        if (this.damageTimer > 0) {
            this.damageTimer -= deltaTime;
        }

        if (this.x + this.width < 0) {
            this.isDead = true;
        }
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

    takeDamage(damage) {

        if (this.damageTimer > 0) {
            return;
        }

        this.health -= damage;
        this.health = clamp(this.health, 0, 3);

        this.damageTimer = this.damageCooldown;

        if (this.health <= 0) {
            this.isDead = true;
        }
    }
}


class Bullet extends GameObject {
    constructor(x, y) {
        super(x, y, 10, 10);

        this.speed = 500;
        this.isDead = false;
    }

    update(deltaTime) {
        this.x += this.speed * deltaTime;

        if (this.x > canvas.width) {
            this.isDead = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";

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

const enemies = [];
let enemySpawnTimer = 0;
const enemySpawnCooldown = 1;

const bullets = [];
bullets.push(
    new Bullet(
        player.x + player.width,
        player.y + player.height / 2
    )
)

function spawnEnemy() {
    const y = getRandomIntInclusive(0, canvas.height - 50);

    enemies.push(new Enemy(canvas.width, y));
}

// --------------------
// Update
// --------------------
function update(deltaTime) {
    player.update(deltaTime);

    enemySpawnTimer -= deltaTime;
    if (enemySpawnTimer <= 0) {
        spawnEnemy();
        enemySpawnTimer = enemySpawnCooldown;
    }

    for (const enemy of enemies) {
        if (enemy.isDead) {
            continue;
        }

        enemy.update(deltaTime);

        if (player.isColliding(enemy)) {
            enemy.takeDamage(1);
        }
    }

    for (const bullet of bullets) {
        bullet.update(deltaTime);

        for (const enemy of enemies) {
            if (enemy.isDead) {
                continue;
            }

            if (bullet.isColliding(enemy)) {
                enemy.takeDamage(1);
                bullet.isDead = true;
                break;
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].isDead) {
            enemies.splice(i, 1);
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].isDead) {
            bullets.splice(i, 1);
        }
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

    player.draw(ctx);

    for (const enemy of enemies) {
        if (!enemy.isDead) {
            enemy.draw(ctx);
        }
    }

    for (const bullet of bullets) {
        bullet.draw(ctx);
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}