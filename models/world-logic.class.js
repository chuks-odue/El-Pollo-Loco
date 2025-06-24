/**
 * Initializes core game logic systems
 * @function initGameLogic
 * @memberof World.prototype
 * @description Sets up world references, collision detection, and bottle throwing
 */

World.prototype.initGameLogic = function() {
    this.setWorld();
    this.checkCollision();
    this.checkThrowBottle();
};


/**
 * Handles player-enemy collision detection and consequences
 * @function checkEnemyCollision
 * @memberof World.prototype
 * @description Processes collisions between player and enemies:
 * - Kills enemy if player lands on top (y-position check + downward velocity)
 * - Damages player for other collision types
 */
World.prototype.checkEnemyCollision = function() {
    this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead && this.character.isColliding(enemy)) {
            if (this.character.y < enemy.y && this.character.speedY >=0) {
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

/**
 * Main collision detection loop
 * @function checkCollision
 * @memberof World.prototype
 * @description Runs at ≈66 FPS (15ms intervals) to check:
 * - Enemy collisions
 * - Collectible collisions
 * - Throwable object collisions
 */
World.prototype.checkCollision = function() {
    this.collisionInterval = setInterval(() => {
        if (this.gameOver || this.paused) return;
        this.checkEnemyCollision();
        this.checkCollectibleCollision();
        this.checkThrowableCollision();
    }, 1000 / 66);
};

/**
 * Handles collectible item collisions
 * @function checkCollectibleCollision
 * @memberof World.prototype
 * @description Processes player collisions with collectibles:
 * - Coins (increases coin meter)
 * - Bottles (adds to inventory)
 * - Health (restores energy)
 */
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

/**
 * Handles coin collection
 * @function collectCoin
 * @memberof World.prototype
 * @param {Object} collectible - Coin object
 * @param {number} index - Position in collectibles array
 * @description Increases coin meter by 20% (max 100%), plays sound
 */
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

/**
 * Handles bottle collection
 * @function collectBottle
 * @memberof World.prototype
 * @param {Object} collectible - Bottle object
 * @param {number} index - Position in collectibles array
 * @description Adds bottle to inventory (max 5), updates UI
 */
World.prototype.collectBottle = function(collectible, index) {
    if (this.character.bottleCount < 5) {
        this.character.bottleCount++;
        this.bottleBar.setPercentage(this.character.bottleCount * 20);
        this.level.collectibles.splice(index, 1);
        this.playSound('collect-bottle');
    }
};

/**
 * Handles health collection
 * @function collectLife
 * @memberof World.prototype
 * @param {Object} collectible - Health object
 * @param {number} index - Position in collectibles array
 * @description Restores 20 energy (max 100), plays sound
 */
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

/**
 * Handles bottle-enemy collisions
 * @function checkBottleEnemyCollision
 * @memberof World.prototype
 * @param {Object} bottle - Throwable bottle object
 * @description Processes collisions between player-thrown bottles and enemies:
 * - Triggers splash animation
 * - Damages enemies
 * - Plays explosion sound
 */
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

/**
 * Handles bottle-player collisions
 * @function checkBottleCharacterCollision
 * @memberof World.prototype
 * @param {Object} bottle - Throwable bottle object
 * @description Processes collisions between endboss-thrown bottles and player:
 * - Damages player
 * - Triggers game over if energy depleted
 */
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

/**
 * Cleans up finished bottle objects
 * @function removeFinishedBottles
 * @memberof World.prototype
 * @description Removes bottles from game world after splash animation completes
 */
World.prototype.removeFinishedBottles = function() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        if (bottle.finishedSplash) {
            this.throwableObjects.splice(i, 1);
        }
    }
};


/**
 * Manages throwable object collisions
 * @function checkThrowableCollision
 * @memberof World.prototype
 * @description Processes all active throwable objects:
 * - Bottle vs enemy collisions
 * - Bottle vs character collisions
 * - Removes finished bottles
 */
World.prototype.checkThrowableCollision = function() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        this.checkBottleEnemyCollision(bottle);
        this.checkBottleCharacterCollision(bottle);
    }
    this.removeFinishedBottles();
};

/**
 * Handles bottle throwing input
 * @function checkThrowBottle
 * @memberof World.prototype
 * @description Listens for 'd' keypress to throw bottles when available
 */
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
 /**
 * Resumes enemy AI and animations
 * @function resumeEnemies
 * @memberof World.prototype
 * @description Restarts enemy movement and attack patterns after pause
 */
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

/**
 * Resumes cloud animations
 * @function resumeClouds
 * @memberof World.prototype
 * @description Restarts background cloud movement after pause
 */
World.prototype.resumeClouds = function() {
    this.level.clouds.forEach((cloud) => {
        cloud.animate();
    });
};

/**
 * Resumes throwable object physics
 * @function resumeThrowableObjects
 * @memberof World.prototype
 * @description Restarts bottle animations and gravity after pause
 */
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

/**
 * Displays game over screen
 * @function showGameOverImage
 * @memberof World.prototype
 * @param {string} result - Game outcome ('win' or 'lose')
 * @description Shows appropriate game over image and plays sound effect
 */
World.prototype.showGameOverImage = function(result) {
    this.gameOver = true;
    this.paused = true;
    this.stop();
    this.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png';
    World.imagesToLoad.push(result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png');

    if (result === 'win') {  this.playSound('win');
    } else { this.playSound('lose');}
    this.gameOverImage.onload = () => { this.gameOverImageShown = true;
        this.draw(); 
    };
    this.gameOverImage.onerror = () => {this.gameOverImageShown = true;
        this.draw(); 
    };
};

/**
 * Activates endboss when visible on screen
 * @function checkEndbossActivation
 * @memberof World.prototype
 * @description Triggers endboss attack patterns when it enters viewport
 */
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