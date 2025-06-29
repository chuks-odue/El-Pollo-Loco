/**
 * Represents the endboss enemy in the game.
 * @extends moveableObject
 */
class Endboss extends moveableObject {
    
    height = 400;    
    width = 250;    
    y = 59;    
    energy = 400;    
    isActivated = false;    
    isDead = false;    
    hasFallen = false;

    /**
     * The walking images of the endboss.
     * @type {string[]}
     */
    WALKING_IMAGES_ENDBOSS = [
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /**
     * The dead images of the endboss.
     * @type {string[]}
     */
    Endboss_DEAD = [
        'img/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * The interval IDs for bottle throwing, movement, animation, and falling.
     * @type {number}
     */
    bottleThrowInterval;
    moveInterval;
    animationInterval;
    fallInterval;

    /**
     * Creates a new endboss.
     * @param {World} world The world object.
     */
    constructor(world) {
        super().loadimage('img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.world = world;
        this.initProperties();
        this.collisionOffset = {
            top: 100,
            bottom: 50,
            left: 50,
            right: 50
        };
        this.clearIntervals();
        this.loadAllImages();
        this.startAnimation();
    }

    /**
     * Initializes the properties of the endboss.
     */
    initProperties() {
        this.x = 2800;
        this.speed = 0.15 + Math.random() * 0.5;
        this.originalSpeed = this.speed;
        this.isActivated = false;
        this.isDead = false;
        this.hasFallen = false;
        this.bottleThrowInterval = null;
        this.moveInterval = null;
        this.animationInterval = null;
        this.fallInterval = null;
        this.movementLimit = 2900;
    }

    /**
     * Clears all intervals.
     */
    clearIntervals() {
        if (this.bottleThrowInterval) clearInterval(this.bottleThrowInterval);
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.fallInterval) clearInterval(this.fallInterval);
    }

    /**
     * Loads all images.
     */
    loadAllImages() {
        this.loadimages(this.WALKING_IMAGES_ENDBOSS);
        this.loadimages(this.Endboss_DEAD);
    }

    /**
     * Starts the animation.
     */
    startAnimation() {
        this.animate();
    }

    /**
     * Throws bottles at the character.
     */
    throwBottles() {
        if (this.bottleThrowInterval) {
            clearInterval(this.bottleThrowInterval);
        }
        this.bottleThrowInterval = setInterval(() => {
            if (!this.isDead && this.isActivated) {
                const isCharacterOnLeft =this.world.character.x < this.x;
                const bottle = new ThrowableObject(this.x, this.y + 250, isCharacterOnLeft, this);
                this.world.throwableObjects.push(bottle);
            }
        }, 2000);
    }

    /**
     * Animates the endboss.
     */
    animateMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
       this.moveInterval = setInterval(() => {
           if (!this.isDead && !this.world.gameOver && !this.world.paused) {
               if (this.x > this.movementLimit) {
                   this.moveLeft();
                } else {
                   this.speed = 0;
                }
            }
        }, 1000 / 60);
    }

    /**
 * Animates the endboss's images.
 */
   animateImages() {
       if (this.animationInterval) clearInterval(this.animationInterval);
         this.animationInterval = setInterval(() => {
           if (this.isDead) {
               if (!this.hasFallen) {
                  this.playAnimation(this.Endboss_DEAD);
                } else {
                  const lastFrame = this.Endboss_DEAD[this.Endboss_DEAD.length - 1];
                  this.loadimage(lastFrame);
                }
            } else {
                this.playAnimation(this.WALKING_IMAGES_ENDBOSS);
            }
        }, 200);
    }


   /**
 * Animates the movement of the endboss.
 * 
 */
    animate() {
      this.animateMovement();
      this.animateImages();
    }

    /**
     * Handles a hit event.
     */
    hit() {
        this.energy -= 100;
        if (this.energy < 0) {
            this.energy = 0;
        }
        const maxEnergy = 400;
        const newPercentage = (this.energy / maxEnergy) * 100;
        if (this.world && this.world.endbossHealthBar) {
            this.world.endbossHealthBar.setPercentage(newPercentage);
        } 
        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Kills the endboss.
     */
    die() {
        this.isDead = true;
        this.speed = 0;

        if (this.bottleThrowInterval) {
            clearInterval(this.bottleThrowInterval);
            this.bottleThrowInterval = null;
        }

        setTimeout(() => {
            this.startFalling();
        }, 2000);
    }

    /**
     * Starts the falling animation.
     */
    startFalling() {
        if (this.fallInterval) clearInterval(this.fallInterval);

        this.fallInterval = setInterval(() => {
            if (this.y < 150) {
                this.y += 5;
            } else {
                clearInterval(this.fallInterval);
                this.hasFallen = true;
                this.world.showGameOverImage('win');
            }
        }, 1000 / 30);
    }
}