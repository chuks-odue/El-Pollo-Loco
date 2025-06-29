/**
 * Represents the main player character in the game, extending common properties and behaviors
 * from `moveableObject`.
 * @extends moveableObject
 */
class Character extends moveableObject {
   
    width = 120;
    height = 240;
    y = 0;   
    speed = 10;   
    bottleCount = 5;   
    world;
    isHurtState = false;   
    hurtTimestamp = 0;   
    hurtDuration = 700;    
    previousY = 190;
    lastBottleThrowTime = 0;
    bottleCooldownDuration = 1000; 
    currentAnimation = null;


    /**
     * Array of image paths for the character's walking animation.
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
     * Array of image paths for the character's jumping animation.
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
     * Array of image paths for the character's death animation.
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
     * Array of image paths for the character's hurt animation.
     * @type {string[]}
     */
    HURT_IMAGES = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Object containing Audio instances for character sounds.
     * @type {object}
     * @property {Audio} walk - Sound for walking.
     * @property {Audio} jump - Sound for jumping.
     * @property {Audio} hurt - Sound for getting hurt.
     */
    sounds = {
        walk: new Audio('audio/concrete-footsteps-6752.mp3'),
        jump: new Audio('audio/slime_jump.mp3'),
        hurt: new Audio('audio/5.ogg'),
    };

    /**
     * Creates an instance of Character.
     * Loads initial image and animation images, sets up collision offsets,
     * applies gravity, and starts animation loops.
     */
    constructor() {
        super().loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.JUMPING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.loadimages(this.HURT_IMAGES);
        this.sounds.walk.loop = true;
        this.previousY = this.y;
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
     * Updates the character's horizontal movement based on keyboard input and level boundaries.
     * Plays or stops the walking sound accordingly.
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
     * Handles character jumping based on keyboard input.
     * Triggers the jump action if the character is not currently above ground.
     */
    updateJumping() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.playSound('jump');
        }
    }

    /**
     * Updates the game camera's horizontal position to follow the character.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * The main update loop for character physics and game state.
     * This method is called repeatedly by `moveInterval`.
     * It captures `previousY` before applying current frame's movement and updates camera.
     */
    updateMainGameLoop() {
        this.previousY = this.y;
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
     * Checks if the character is falling onto another object, indicating a potential "stomp".
     * This differentiates a stomp from a general collision.
     * @param {moveableObject} otherObject - The object (e.g., enemy) being collided with.
     * @returns {boolean} True if the character is in a stomping position, false otherwise.
     */
    isFallingOn(otherObject) {
        const charCurrentBottom = this.y + this.height - this.collisionOffset.bottom;
        const charPreviousBottom = this.previousY + this.height - this.collisionOffset.bottom;
        const enemyTop = otherObject.y + otherObject.collisionOffset.top;
        const enemyLeft = otherObject.x + otherObject.collisionOffset.left;
        const enemyRight = otherObject.x + otherObject.width - otherObject.collisionOffset.right;
        const charLeft = this.x + this.collisionOffset.left;
        const charRight = this.x + this.width - this.collisionOffset.right;
        const isFalling = this.speedY < 0;
        const isAboveGroundBeforeCollision = charPreviousBottom < enemyTop;
        const isNowCollidingAtEnemyTop = charCurrentBottom >= enemyTop;
        const justCrossedOverEnemy = isAboveGroundBeforeCollision && isNowCollidingAtEnemyTop;
        const horizontalOverlap = charRight > enemyLeft && charLeft < enemyRight;
        return (isFalling || justCrossedOverEnemy) && horizontalOverlap;
    }

    /**
     * Makes the character perform a small upward jump/bounce, typically after successfully stomping an enemy.
     * @returns {void}
     */
    jumpAfterEnemyBounce() {
        this.speedY = 20;
    }

    /**
     * Updates the character's visual animation based on its current state (dead, hurt, jumping, walking, idle).
     * @returns {void}
    */
    updateAnimation() {
        if (this.isDead()) {this.playAnimation(this.DEAD_IMAGES);
            this.currentAnimation = 'dead';
        } else if (this.isHurt()) { this.playAnimation(this.HURT_IMAGES);
            this.currentAnimation = 'hurt';
            if (Date.now() - this.hurtTimestamp > this.hurtDuration) { this.isHurtState = false;}
        } else if (this.isAboveGround()) {this.playAnimation(this.JUMPING_IMAGES);
            this.currentAnimation = 'jumping';
        } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.world.gameOver) {
            this.playAnimation(this.WALKING_IMAGES); this.currentAnimation = 'walking';
        } else {
            if (this.currentAnimation !== 'idle') {this.loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
                this.currentAnimation = 'idle';
            }
        }
    }

    /**
     * Sets up and manages the intervals for the character's movement and animation updates.
     * Clears any previous intervals before starting new ones.
     * @returns {void}
     */
    animate() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);

        this.moveInterval = setInterval(() => {
            this.updateMainGameLoop();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.world.gameOver) {
                this.updateAnimation();
            } else if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGES);
                if (this.currentImage % this.DEAD_IMAGES.length === this.DEAD_IMAGES.length - 1) {
                    this.stopAnimation();
                    this.loadimage(this.DEAD_IMAGES[this.DEAD_IMAGES.length - 1]);
                }
            } else {
                this.stopAnimation();
            }
        }, 50);
    }

    /**
     * Plays the character's walking sound if sound is enabled and the sound is not already playing.
     * @returns {void}
     */
    playWalkingSound() {
        if (soundEnabled && this.sounds.walk.paused) {
            this.sounds.walk.play();
        }
    }

    /**
     * Stops the character's walking sound and resets its playback position.
     * @returns {void}
     */
    stopWalkingSound() {
        if (!this.sounds.walk.paused) {
            this.sounds.walk.pause();
            this.sounds.walk.currentTime = 0;
        }
    }

    /**
     * Plays a specified character sound if sound is enabled.
     * @param {string} name - The name of the sound to play (e.g., 'jump', 'hurt').
     * @returns {void}
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
     * Initiates the character's jump by setting its upward vertical speed (`speedY`).
     * Also plays the jump sound.
     * @returns {void}
     */
    jump() {
        this.speedY = 40;
        if (soundEnabled) {
            this.playSound('jump');
        }
    }

    /**
     * Stops the character's animation interval, effectively freezing its animation frames.
     * @returns {void}
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}
