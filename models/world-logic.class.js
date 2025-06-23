// Game initialization and logic
World.prototype.initGameLogic = function() {
    this.setWorld();
    this.checkCollision();
    this.checkThrowBottle();
};

// Enemy and item collision handling


World.prototype.checkEnemyCollision = function() {
    this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && this.character.isColliding(enemy)) {
            if (this.character.y < enemy.y && this.character.speedY >= 0) {
                enemy.die();
                this.character.speedY = -10;
            } else {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                if (this.character.energy <= 0) {
                    this.showGameOverImage('lose');
                }
            }
        }
    });
};


// In character.class.js
Character.prototype.isLandingOn = function(object) {
    const characterBottom = this.y + this.height;
    const objectTop = object.y;
    return (
        this.speedY > 0 && 
        characterBottom >= objectTop - 5 && 
        characterBottom <= objectTop + 20
    );
};

World.prototype.checkCollision = function() {
    this.collisionInterval = setInterval(() => {
        if (this.gameOver || this.paused) return;
        this.checkEnemyCollision();
        this.checkCollectibleCollision();
        this.checkThrowableCollision();
    }, 1000 / 66);
};

World.prototype.checkCollectibleCollision = function() {
    this.level.collectibles.forEach((collectible, index) => {
        if (this.character.isColliding(collectible)) {
            if (collectible.type === 'coin') {
                this.collectCoin(collectible, index);
            } else if (collectible.type === 'bottle') {
                this.collectBottle(collectible, index);
            } else if (collectible.type === 'life') {
                this.collectLife(collectible, index);
            } else {
                this.level.collectibles.splice(index, 1);
            }
        }
    });
};

World.prototype.collectCoin = function(collectible, index) {
    if (this.coinBar.percentage < 100) {
        this.coinBar.percentage += 20;
        if (this.coinBar.percentage > 100) {
            this.coinBar.percentage = 100;
        }
        this.coinBar.setPercentage(this.coinBar.percentage);
        this.playSound('coin');
        this.level.collectibles.splice(index, 1);
    } else {
        this.playSound('coin-lost');
    }
};

World.prototype.collectBottle = function(collectible, index) {
    if (this.character.bottleCount < 5) {
        this.character.bottleCount++;
        this.bottleBar.setPercentage(this.character.bottleCount * 20);
        this.level.collectibles.splice(index, 1);
        this.playSound('collect-bottle');
    }
};

World.prototype.collectLife = function(collectible, index) {
    if (this.character.energy < 100) {
        this.character.energy += 20;
        if (this.character.energy > 100) {
            this.character.energy = 100;
        }
        this.statusBar.setPercentage(this.character.energy);
        this.level.collectibles.splice(index, 1);
        this.playSound('collect-life');
    }
};

// Bottle collision handling
World.prototype.checkBottleEnemyCollision = function(bottle) {
    if (!bottle || typeof bottle !== 'object' || !('owner' in bottle)) return;

    this.level.enemies.forEach((enemy) => {
        const isBottleFromCharacter = bottle.owner instanceof Character;

        if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
            if (isBottleFromCharacter && !(enemy instanceof Character)) {
                bottle.splash();
                bottle.hasHit = true;
                enemy.hit();
                this.playSound('explode');
            }
        }
    });
};

World.prototype.checkBottleCharacterCollision = function(bottle) {
    if (!bottle || typeof bottle !== 'object') return;
    if (bottle.owner instanceof Endboss && bottle.isColliding(this.character) && !bottle.hasHit) {
        bottle.splash();
        bottle.hasHit = true;
        this.character.hit();
        this.playSound('bottle-hit');
        this.statusBar.setPercentage(this.character.energy);
        if (this.character.energy <= 0) {
            this.showGameOverImage('lose');
        }
    }
};

World.prototype.removeFinishedBottles = function() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        if (bottle.finishedSplash) {
            this.throwableObjects.splice(i, 1);
        }
    }
};

World.prototype.checkThrowableCollision = function() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        this.checkBottleEnemyCollision(bottle);
        this.checkBottleCharacterCollision(bottle);
    }
    this.removeFinishedBottles();
};

World.prototype.checkThrowBottle = function() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'd' && this.character.bottleCount > 0 && !this.gameOver && !this.paused) {
            this.throwBottle();
            this.playSound('throw');
        }
    });
    document.addEventListener('throwBottle', () => {
        if (this.character.bottleCount > 0 && !this.gameOver && !this.paused) {
            this.throwBottle();
            this.playSound('throw');
        }
    });
};

// Game state management
World.prototype.resumeEnemies = function() {
    this.level.enemies.forEach((enemy) => {
        if (enemy.originalSpeed) {
            enemy.speed = enemy.originalSpeed;
        }
        if (enemy.moveInterval) {
            clearInterval(enemy.moveInterval);
            enemy.moveInterval = null;
        }
        if (enemy.animationInterval) {
            clearInterval(enemy.animationInterval);
            enemy.animationInterval = null;
        }
        if (enemy instanceof Endboss) {        
            enemy.throwBottles();                                  
        }
        enemy.animate();
    });
};

World.prototype.resumeClouds = function() {
    this.level.clouds.forEach((cloud) => {
        cloud.animate();
    });
};

World.prototype.resumeThrowableObjects = function() {
    this.throwableObjects.forEach((bottle) => {
        if (!bottle.animationInterval) {
            bottle.animate(); 
        }

        if (!bottle.gravityInterval && !bottle.hasHit) {
            bottle.applyGravity();
        }
    });
};

World.prototype.showGameOverImage = function(result) {
    this.gameOver = true;
    this.paused = true;
    this.stop();

    this.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png';
    World.imagesToLoad.push(result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png');

    if (result === 'win') {
        this.playSound('win');
    } else {
        this.playSound('lose');
    }

    this.gameOverImage.onload = () => {
        this.gameOverImageShown = true;
        this.draw(); 
    };
    this.gameOverImage.onerror = () => {
        this.gameOverImageShown = true;
        this.draw(); 
    };
};

// Endboss activation
World.prototype.checkEndbossActivation = function() {
    this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && !enemy.isActivated && !enemy.isDead) {
            const bossVisibleOnCanvasRight = enemy.x + this.camera_x < this.canvas.width;
            const bossVisibleOnCanvasLeft = enemy.x + enemy.width + this.camera_x > 0;

            if (bossVisibleOnCanvasRight && bossVisibleOnCanvasLeft) {
                enemy.isActivated = true;
                enemy.throwBottles();
            }
        }
    });
};