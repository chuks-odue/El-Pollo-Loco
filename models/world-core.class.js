/**
 * Drawing methods for World class
 */

/**
 * Checks if the endboss is activated and throws bottles.
 */
World.prototype.checkEndboss = function() {
    if (this.endboss && !this.endboss.isDead) {
        const bossInView = this.endboss.x < this.camera_x + this.canvas.width;

        if (bossInView && !this.endboss.isActivated) {
            this.endboss.isActivated = true;
            this.endboss.throwBottles();
        }

        this.endboss.flipImage(this.character.otherDirection);
    }
};

/**
 * Checks if the endboss is visible on the canvas and activates it if so.
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

/**
 * Draws the background objects.
 */
World.prototype.drawBackground = function() {
    this.addObjectsToMap(this.level.backgroundobjects);
};

/**
 * Draws the main game objects (character, collectibles, enemies, clouds).
 */
World.prototype.drawMainGameObjects = function() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.collectibles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
};

/**
 * Draws the throwable objects (bottles).
 */
World.prototype.drawThrowableObjects = function() {
    this.throwableObjects.forEach((bottle) => {
        bottle.move();
    });
    this.addObjectsToMap(this.throwableObjects);
};

/**
 * Draws the dropped coins.
 */
World.prototype.drawDroppedCoins = function() {
    this.droppedCoins.forEach((coin) => {
        coin.update();
        this.addToMap(coin);
    });
};

/**
 * Draws all game objects (main objects, throwable objects, dropped coins).
 */
World.prototype.drawGameObjects = function() {
    this.drawMainGameObjects();
    if (!this.gameOver) {
        this.drawThrowableObjects();
        this.drawDroppedCoins();
    } else {
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.droppedCoins);
    }
};

/**
 * Draws the user interface (bottle bar, status bar, coin bar, touch controls).
 */
World.prototype.drawUI = function() {
    this.addToMap(this.bottleBar);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.touchControls.draw();
    this.addToMap(this.endbossHealthBar);
};

/**
 * Draws the buttons (play/pause, restart, quit).
 */
World.prototype.drawButtons = function() {  
    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);
    if (!this.gameOver) {
        this.playPauseButton.draw();
    } else {
        this.restartButton.draw();
    }
    if (this.quitButton) this.quitButton.draw();
};

/**
 * Draws the game over image.
 */
World.prototype.drawGameOverImage = function() {
    if (this.gameOverImageShown && this.gameOverImage.complete) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 300, 150);
        this.ctx.restore();
    }
};


/**
 * Main draw function that calls all other drawing methods.
 */
World.prototype.draw = function() {
    if (this.paused && !this.gameOverImageShown) {
        this.animationFrameId = null; return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackground(); this.checkEndbossActivation(); 
    this.drawGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.drawUI();this.drawButtons(); this.drawGameOverImage();
    let self = this;
    this.animationFrameId = requestAnimationFrame(function() {
        self.draw();
    });
    if (!this.gameInitialized) { this.gameInitialized = true; }
};

/**
 * Adds multiple objects to the map.
 * @param {Array} objects - The objects to add to the map.
 */
World.prototype.addObjectsToMap = function(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
};

/**
 * Adds a single object to the map.
 * @param {Object} mo - The object to add to the map.
 */
World.prototype.addToMap = function(mo) {
    if (mo.otherDirection) {
        this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
        this.flipImageBack(mo);
    }
};

/**
 * Flips the image of an object.
 * @param {Object} mo - The object to flip.
 */
World.prototype.flipImage = function(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
};

/**
 * Flips the image of an object back to its original state.
 * @param {Object} mo - The object to flip back.
 */
World.prototype.flipImageBack = function(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
};