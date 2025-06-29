/**
 * Represents the game world, managing game logic, UI, and rendering.
 */
class World {
    soundEnabled = true;
    static imagesToLoad = [];
    gameInitialized = false;
    character = new Character();
    level = level1;    
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar('health');    
    coinBar = new StatusBar('coin');
    bottleBar = new StatusBar('bottle');
    endbossHealthBar = new StatusBar('endbossHealth');
    collisionManager;    
    throwableObjects = [];    
    droppedCoins = [];    
    playPauseButton;
    pausedIcon = new Image();
    playIcon = new Image();
    gameOverImage = new Image();
    gameOverImageShown = false;
    gameOver = false;
    paused = false;    
    animationFrameId = null;
    gameLifecycleManager;

    /**
     * Initializes properties of the game world.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Keyboard} keyboard - Keyboard input handler.
     */
    initProperties(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundEnabled = soundEnabled;
    }

    /**
     * Initializes game logic.
     */
    initGameLogic() {
        this.setWorld();
        this.collisionManager.startCollisionChecks();
        this.collisionManager.checkThrowBottle();
        this.gameLifecycleManager.startCollisionDetection();
    }

    /**
     * Initializes UI components.
     */
    initUIComponents() {
        this.restartButton = new RestartButton(650, 10, 100, 30, this.ctx, 'Replay');
        this.quitButton = new QuitButton(770, 10, 40, 40, this.ctx, 'Quit');
        this.touchControls = new TouchControls(this.ctx, this.canvas);
        this.touchControls.handleTouchEvents(this.canvas, this.keyboard);
    }

    /**
     * Loads play/pause icons.
     */
    loadPlayPauseIcons() {
        this.pausedIcon.src = 'img/assets/pause_circle.svg';
        World.imagesToLoad.push('img/assets/pause_circle.svg');
        this.playIcon.src = 'img/assets/smart_play__WHITE.svg';
        World.imagesToLoad.push('img/assets/smart_play__WHITE.svg');
        let self = this;
        let imagesLoaded = 0;

        function imageLoaded() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                self.playPauseButton = new Button(680, 10, 40, 40, self.ctx, self.pausedIcon, self.playIcon);
                self.playPauseButton.icon = self.pausedIcon;
                self.draw();
            }
        }
        this.pausedIcon.onload = imageLoaded;
        this.playIcon.onload = imageLoaded;
    }

    /**
     * Creates a new instance of the game world.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Keyboard} keyboard - Keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.initProperties(canvas, keyboard);
        this.initManagers();
        this.initGameLogic();
        this.initUIComponents();
        this.loadPlayPauseIcons();
        this.character.bottleCount = 0;
        this.bottleBar = new StatusBar('bottle');
        this.bottleBar.setPercentage(this.character.bottleCount * 20);
    }

    /**
     * Initializes managers.
     */
    initManagers() {
        this.collisionManager = new CollisionManager(this);
        this.gameLifecycleManager = new GameLifecycleManager(this);
    }

    /**
     * Sets the world property for the character and enemies.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
        if (this.level.endboss) {
            this.level.endboss.world = this;
        }
    }

    /**
     * Loads an image.
     * @param {string} src - The source URL of the image.
     */
    loadImage(src) {
        World.imagesToLoad.push(src);
    }

    /**
     * Throws a bottle.
    */
    throwBottle() {        
        const currentTime = Date.now();
        if (this.character.bottleCount > 0 &&
            (currentTime - this.character.lastBottleThrowTime > this.character.bottleCooldownDuration)) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 150, this.character.otherDirection);
            bottle.owner = this.character;
            this.throwableObjects.push(bottle);
            this.character.bottleCount--;
            this.bottleBar.setPercentage(this.character.bottleCount * 20);            
            this.character.lastBottleThrowTime = currentTime;
        }
    }
   

    /**
     * Checks if the end boss should be activated.
     */
    checkEndboss() {
        if (this.endboss && !this.endboss.isDead) {
            const bossInView = this.endboss.x < this.camera_x + this.canvas.width;
            if (bossInView && !this.endboss.isActivated) {
                this.endboss.isActivated = true;
                this.endboss.throwBottles();
            }
            this.endboss.flipImage(this.character.otherDirection);
        }
    }

    /**
     * Draws the background.
     */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundobjects);
    }

    /**
     * Draws main game objects.
     */
    drawMainGameObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectibles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws throwable objects (bottles).
     */
    drawThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            bottle.move();
        });
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Draws dropped coins.
     */
    drawDroppedCoins() {
        this.droppedCoins.forEach((coin) => {
            coin.update();
            this.addToMap(coin);
        });
    }

    /**
     * Draws game objects.
     */
    drawGameObjects() {
        this.drawMainGameObjects();
        if (!this.gameOver) {
            this.drawThrowableObjects();
            this.drawDroppedCoins();
        } else {
            this.addObjectsToMap(this.throwableObjects);
            this.addObjectsToMap(this.droppedCoins);
        }
    }

    /**
     * Draws UI components.
     */
    drawUI() {
        this.addToMap(this.bottleBar);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.touchControls.draw();
        this.addToMap(this.endbossHealthBar);
    }

    /**
     * Draws buttons.
     */
    drawButtons() {
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
        if (!this.gameOver) {
            this.playPauseButton.draw();
        } else {
            this.restartButton.draw();
        }
        if (this.quitButton) this.quitButton.draw();
    }

    /**
     * Checks if the end boss should be activated based on camera position.
     */
    checkEndbossActivation() {
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
    }

    /**
     * Draws the game over image.
     */
    drawGameOverImage() {
        if (this.gameOverImageShown && this.gameOverImage.complete) {
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 300, 150);
            this.ctx.restore();
        }
    }

    /**
     * Draws the game world.
     */
    draw() {
        if (this.paused && !this.gameOverImageShown) {
            this.animationFrameId = null;
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawBackground();
        this.checkEndbossActivation();
        this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();
        this.drawButtons();
        this.drawGameOverImage();
        let self = this;
        this.animationFrameId = requestAnimationFrame(function () {
            self.draw();
        });
        if (!this.gameInitialized) {
            this.gameInitialized = true;
        }
    }

    /**
     * Adds objects to the map.
     * @param {Drawable[]} objects - Array of objects to add.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds an object to the map.
     * @param {Drawable} mo - Object to add.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally.
     * @param {Drawable} mo - Object whose image to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the image after flipping.
     * @param {Drawable} mo - Object whose image was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Plays a sound.
     * @param {string} name - Name of the sound to play.
     */
    playSound(name) {
        if (this.soundEnabled) {
            const sound = allGameSounds[name];
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.5;
                sound.play().catch(err => console.error('Sound playback error:', err));
            }
        }
    }

    /**
     * Displays the game over image and stops all game activity.
     * @param {string} result - 'win' or 'lose'
     */
    showGameOverImage(result) {
        this.gameLifecycleManager.showGameOverImage(result);
    }

    /**
     * Quits the game.
     */
    quitGame() {
        window.location.href = 'index.html';
    }
}