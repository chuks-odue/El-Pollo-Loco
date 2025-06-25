/**
 * Represents the game world.
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
    collisionInterval = null;

    sounds = {
        'throw': new Audio('audio/SHOOT011.mp3'),
        'collect-bottle': new Audio('audio/collect-bottle.wav'),
        'collect-life': new Audio('audio/collect-life.ogg'),
        'explode': new Audio('audio/8bit_bomb_explosion.wav'),
        'win': new Audio('audio/Won!.wav'),
        'bottle-hit': new Audio('audio/1.mp3'),
        'lose': new Audio('audio/vgdeathsound.ogg'),
        'coin': new Audio('audio/collect-coin.mp3'),
    };

        /**
     * Initializes the world properties.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Object} keyboard - The keyboard input.
     */
    initProperties(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundEnabled = soundEnabled;
    }

     /**
     * Initializes the UI components.
     */
    initUIComponents() {
        this.restartButton = new RestartButton(650, 10, 100, 30, this.ctx, 'Replay');
        this.quitButton = new QuitButton(770, 10, 40, 40, this.ctx, 'Quit');
        this.touchControls = new TouchControls(this.ctx, this.canvas);
        this.touchControls.handleTouchEvents(this.canvas, this.keyboard);
    }

     /**
     * Loads the play/pause icons.
     */
    loadPlayPauseIcons() {
        this.pausedIcon.src = 'img/assets/pause_circle.svg';
        World.imagesToLoad.push('img/assets/pause_circle.svg');
        this.playIcon.src = 'img/assets/smart_play__WHITE.svg';
        World.imagesToLoad.push('img/assets/smart_play__WHITE.svg');
        let self = this;
        let imagesLoaded = 0;
        function imageLoaded() { imagesLoaded++;
            if (imagesLoaded === 2) {
                self.playPauseButton = new Button(680, 10, 40, 40, self.ctx, self.pausedIcon, self.playIcon);
                self.playPauseButton.icon = self.pausedIcon; self.draw();
            }
        }
        this.pausedIcon.onload = imageLoaded; this.playIcon.onload = imageLoaded;
    }

    
    /**
     * Creates a new World instance.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Object} keyboard - The keyboard input.
     */
    constructor(canvas, keyboard) {
        this.initProperties(canvas, keyboard);
        this.initGameLogic();
        this.initUIComponents();
        this.loadPlayPauseIcons();     
        this.character.bottleCount = 0;
        this.bottleBar = new StatusBar('bottle');
        this.bottleBar.setPercentage(this.character.bottleCount * 20);
    }

     /**
     * Sets the world for the character and enemies.
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
     * @param {string} src - The image source URL.
     */    
    loadImage(src) {
        World.imagesToLoad.push(src);
    }

    /**
     * Throws a bottle.
     */
    throwBottle() {
        if (this.character.bottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50, this.character.otherDirection);
            bottle.owner = this.character;
            this.throwableObjects.push(bottle); 
            this.character.bottleCount--;
            this.bottleBar.setPercentage(this.character.bottleCount * 20);
        }
    }

    /**
     * Pauses the game.
     */
    pause() {
        this.paused = true;
        this.stop();
    }    

    /**
     * Resumes the character's animation.
     */
    resumeCharacter() {
        this.character.animate();
        if (this.character.originalSpeed) {
            this.character.speed = this.character.originalSpeed;
        }
    }

    /**
     * Starts the animation.
     */
    startAnimation() {
        if (!this.animationFrameId) {
            this.draw();
        }
    }

    /**
     * Starts the collision detection.
     */
    startCollisionDetection() {
        if (!this.collisionInterval) {
            this.checkCollision();
        }
    }

    /**
     * Resumes the game.
     */
    resume = () => {
        this.paused = false;
        this.resumeCharacter();
        this.resumeEnemies();
        this.resumeClouds();
        this.resumeThrowableObjects();
        this.startAnimation();
        this.startCollisionDetection();
        this.character.applyGravity();
    }

     /**
     * Plays a sound.
     * @param {string} name - The sound name.
     */
    playSound(name) {
        if (this.soundEnabled) {
            const sound = this.sounds[name];
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.5;
                sound.play().catch(err => console.error('Sound error:', err));
            }
        }
    } 

    /**
     * Stops the animation.
     */
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

     /**
     * Stops the collision interval.
     */
    stopCollisionInterval() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

    
    /**
     * Stops the game objects.
     */
    stopMovableObjects() {        
        const allMovableObjects = [
            this.character,
            ...this.level.enemies,
            ...this.level.clouds,
            ...this.throwableObjects
        ];
        allMovableObjects.forEach(obj => {
            this.stopObjectIntervals(obj);
            if (obj.speed !== undefined) {
                obj.originalSpeed = obj.speed;
                obj.speed = 0;
            }
        });
    }

     /**
     * Stops the movable objects.
     */
    stopObjectIntervals(obj) {
        if (obj.animationInterval) {
            clearInterval(obj.animationInterval);
            obj.animationInterval = null;
        }
        if (obj.moveInterval) {
            clearInterval(obj.moveInterval);
            obj.moveInterval = null;
        }
        if (obj.gravityInterval) {
            clearInterval(obj.gravityInterval);
            obj.gravityInterval = null;
        }
    }

    /**
     * Clears intervals for all game objects.
     */
    clearGameObjects() {
        this.throwableObjects = [];
        this.droppedCoins = [];
    }

     /**
     * Stops object intervals.
     * @param {Object} obj - The object.
     */
   stop() {
       this.stopAnimation();
      this.stopCollisionInterval();
       this.stopGameObjects();
        this.stopCharacterSounds();
    }

    stopAnimation() {
       if (this.animationFrameId) {
           cancelAnimationFrame(this.animationFrameId);
           this.animationFrameId = null;
        }
    }

    
    /**
     * Stops the game.
     */
    stopCollisionInterval() {
       if (this.collisionInterval) {
           clearInterval(this.collisionInterval);
           this.collisionInterval = null;
        }
    }

    /**
     * Stops the game objects.
     */    
   stopGameObjects() {
       this.stopMovableObjects();
       this.clearIntervalsForAllGameObjects();
    }

    /**
     * Stops the movable objects.
     */
    stopMovableObjects() {
        const allMovableObjects = [
           this.character,
           ...this.level.enemies,
           ...this.level.clouds,
           ...this.throwableObjects
        ];
        allMovableObjects.forEach(obj => {
           this.stopObjectIntervals(obj);
           if (obj.speed !== undefined) {
               obj.originalSpeed = obj.speed;
               obj.speed = 0;
            }
        });
    }

    clearIntervalsForAllGameObjects() {
        const allGameObjects = [
            this.character,
           ...this.level.enemies,
            ...this.throwableObjects,
            ...this.level.clouds
        ];
        allGameObjects.forEach(obj => {
            if (obj && typeof obj.clearAllIntervals === 'function') {
               obj.clearAllIntervals();
            }
        });
    }

     /**
     * Stops object intervals.
     * @param {Object} obj - The object.
     */
    stopObjectIntervals(obj) {
        if (obj.animationInterval) {
            clearInterval(obj.animationInterval);
            obj.animationInterval = null;
        }
        if (obj.moveInterval) {
           clearInterval(obj.moveInterval);
            obj.moveInterval = null;
        }
        if (obj.gravityInterval) {
           clearInterval(obj.gravityInterval);
           obj.gravityInterval = null;
        }
    }

    /**
     * Stops character sounds.
     */
    stopCharacterSounds() {
        if (this.character.sounds.walk && !this.character.sounds.walk.paused) {
            this.character.sounds.walk.pause();
            this.character.sounds.walk.currentTime = 0;
        }
    }

     /**
     * Quits the game.
     */
    quitGame() {
        window.location.href = 'index.html';
    }
    
}