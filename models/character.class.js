/**
 * Represents a character in the game.
 * @extends moveableObject
 */
class Character extends moveableObject {
    /**
     * The width of the character.
     * @type {number}
     */
    width = 120;
            

    /**
     * The height of the character.
     * @type {number}
     */
    height = 240;

    /**
     * The y-coordinate of the character.
     * @type {number}
     */
    y = 30;

    /**
     * The speed of the character.
     * @type {number}
     */
    speed = 10;

    /**
     * The number of bottles the character has.
     * @type {number}
     */
    bottleCount = 5;

    /**
     * The world object.
     * @type {World}
     */
    world;

    /**
     * Flag to track whether the character is hurt.
     * @type {boolean}
     */
    isHurtState = false;

    /**
     * The timestamp of when the character was hurt.
     * @type {number}
     */
    hurtTimestamp = 0;

    /**
     * The duration of the hurt state.
     * @type {number}
     */
    hurtDuration = 700;

    /**
     * The walking images of the character.
     * @type {string[]}
     */
    WALKING_IMAGES = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * The jumping images of the character.
     * @type {string[]}
     */
    JUMPING_IMAGES = [
        'img/img/2_character_pepe/3_jump/J-31.png',
        'img/img/2_character_pepe/3_jump/J-32.png',
        'img/img/2_character_pepe/3_jump/J-33.png',
        'img/img/2_character_pepe/3_jump/J-34.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-36.png',
        'img/img/2_character_pepe/3_jump/J-37.png',
        'img/img/2_character_pepe/3_jump/J-38.png',
        'img/img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * The dead images of the character.
     * @type {string[]}
     */
    DEAD_IMAGES = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * The hurt images of the character.
     * @type {string[]}
     */
    HURT_IMAGES = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * The sounds of the character.
     * @type {Object}
     */
    sounds = {
        walk: new Audio('audio/concrete-footsteps-6752.mp3'),
        jump: new Audio('audio/slime_jump.mp3'),
        hurt: new Audio('audio/5.ogg'),
    };

    /**
     * Creates a new character.
     */
    constructor() {
        super().loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.JUMPING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.loadimages(this.HURT_IMAGES);
        this.sounds.walk.loop = true;
        this.collisionOffset = {
            top: 80,   
            bottom: 10, 
            left: 30,  
            right: 30  
        };
        this.applyGravity();
        this.animate();
        this.previousY = this.y;
        this.showCollisionBox = true; 
    }

    /**
     * Updates the movement of the character.
     */
    updateMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
            this.playWalkingSound();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }

    /**
     * Updates the jumping of the character.
     */
    updateJumping() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.playSound('jump');
        }
    }

    /**
     * Updates the camera position.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Updates the main game loop.
     */
    updateMainGameLoop() {
        
        if (!this.world.gameOver) {
            this.updateMovement();
            this.updateJumping();
            this.updateCamera();
                this.lastY = this.y;

        } else {
            this.stopWalkingSound();
        }
    }

    /**
     * Updates the animation of the character.
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.DEAD_IMAGES);
        } else if (this.isHurt()) {
            this.playAnimation(this.HURT_IMAGES);
            if (Date.now() - this.hurtTimestamp > this.hurtDuration) {
                this.isHurtState = false;
            }
        } else if (this.isAboveGround()) {
            this.playAnimation(this.JUMPING_IMAGES);
        } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.world.gameOver) {
            this.playAnimation(this.WALKING_IMAGES);
        } else {
            this.loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        }
    }

    /**
     * Animates the character.
     */
    animate() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        this.moveInterval = setInterval(() => { this.updateMainGameLoop();
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (!this.world.gameOver) {
                this.updateAnimation();
            } else if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGES);
                if (this.currentImage % this.DEAD_IMAGES.length === this.DEAD_IMAGES.length - 1) {
                    this.stopAnimation();
                    this.loadimage(this.DEAD_IMAGES[this.DEAD_IMAGES.length - 1]); }
            } else { this.stopAnimation();}
        }, 50);
    }

    /**
     * Plays the walking sound.
     */
    playWalkingSound() {
        if (soundEnabled && this.sounds.walk.paused) {
            this.sounds.walk.play();
        }
    }

    /**
     * Stops the walking sound.
     */
    stopWalkingSound() {
        if (!this.sounds.walk.paused) {
            this.sounds.walk.pause();
            this.sounds.walk.currentTime = 0;
        }
    }

    /**
     * Plays a sound.
     * @param {string} name The name of the sound.
     */
    playSound(name) {
        if (soundEnabled) {
            const sound = this.sounds[name];
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        }
    }

    /**
     * Makes the character jump.
     */
    jump() {
        this.speedY = 40;
        if (soundEnabled) {
            this.playSound('jump');
        }
    }

    /**
     * Stops the animation.
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }


    
}