/**
 * Represents a small chicken enemy.
 * @extends moveableObject
 */
class SmallChicken extends moveableObject {
        world; 


     /**
     * The y-coordinate of the chicken.
     * @type {number}
     */
    y = 400;

     /**
     * The width of the chicken.
     * @type {number}
     */
    width = 40;
      /**
     * The height of the chicken.
     * @type {number}
     */
    height = 40;
    /**
     * The speed of the chicken.
     * @type {number}
     */
    speed = 0.2 + Math.random() * 0.1;

     /**
     * The energy of the chicken.
     * @type {number}
     */
    energy = 50;

     /**
     * Flag to track whether the chicken is dead.
     * @type {boolean}
     */
    isDead = false;

    /**
     * The vertical speed of the chicken.
     * @type {number}
     */
    speedY = 0;
    
     /**
     * The interval IDs for movement, jumping, and animation.
     * @type {number}
     */
    moveInterval;
    jumpInterval;
    animationInterval;

     /**
     * The walking images of the chicken.
     * @type {string[]}
     */
    WALKING_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

      /**
     * The dead images of the chicken.
     * @type {string[]}
     */
    DEAD_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

     /**
     * Creates a new small chicken enemy.
     * @param {World} world The world object.
     */
    constructor(world) {
        super().loadimage('img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.x = 400 + Math.random() * 1700;
        this.originalSpeed = this.speed;
        this.world = world;
        this.animate();
    }

    /**
     * Animates the chicken.
     */
    animate() {
        this.clearAnimationIntervals();
        this.startMovement();
        this.startJumping();
        this.startAnimationLoop();
    }

    /**
     * Clears the animation intervals.
     */
    clearAnimationIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.jumpInterval) clearInterval(this.jumpInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
    }

    /**
     * Starts the movement of the chicken.
     */

    startMovement() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead && !this.world.gameOver && !this.world.paused) {
                this.moveLeft();
                this.updatePosition();
            }
        }, 1000 / 60);
    }

    /**
     * Starts the jumping of the chicken.
     */

    startJumping() {
        this.jumpInterval = setInterval(() => {
            if (!this.isDead && !this.world.gameOver && !this.world.paused && Math.random() < 0.05) {
                this.jump();
            }
        }, 1000 / 60);
    }

     /**
     * Starts the animation loop of the chicken.
     */
    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.DEAD_IMAGES);
            } else {
                this.playAnimation(this.WALKING_IMAGES);
            }
        }, 200);
    }

     /**
     * Makes the chicken jump.
     */
    jump() {
        if (this.y >= 380) {
            this.speedY = -20;
        }
    }

    /**
     * Updates the position of the chicken.
     */
    updatePosition() {
        this.y += this.speedY;
        if (this.y < 400) {
            this.speedY += 1;
        } else {
            this.y = 400;
            this.speedY = 0;
        }
    }

     /**
     * Plays the animation of the chicken.
     * @param {string[]} images The images to play.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

     /**
     * Handles a hit event.
     */
    hit() {
        this.energy -= 50;
        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Kills the chicken.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.loadimage(this.DEAD_IMAGES);
        setTimeout(() => {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 2000);
    }
}
