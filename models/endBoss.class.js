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
    isHurtState = false;
    hurtTimestamp = 0;
    hurtDuration = 700; 
    isAttacking = false;
     movementDirection = -1;  

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

     ENDBOSS_ATTACK_IMAGES = [
        'img/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/img/4_enemie_boss_chicken/3_attack/G19.png',

        
    ];

    ENDBOSS_HURT_IMAGES = [
        'img/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G23.png',        
    ];
    
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
        this.loadimages(this.ENDBOSS_HURT_IMAGES); 
                this.loadimages(this.ENDBOSS_ATTACK_IMAGES); 

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
        this.movementDirection = -1;
        this.x = 3200;
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
        this.isAttacking = false; 
        this.movementRightLimit = 3200;
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
            if (!this.isDead && this.isActivated && !this.isHurtState) { // Don't throw if dead or hurt
                // Set attacking state
                this.isAttacking = true;

                // Determine bottle direction
                const isCharacterOnLeft = this.world.character.x < this.x;
                const bottle = new ThrowableObject(this.x, this.y + 250, isCharacterOnLeft, this);
                this.world.throwableObjects.push(bottle);

                // Reset attacking state after a short duration (e.g., 500ms for attack animation)
                // This duration should be carefully tuned to match your attack animation
                setTimeout(() => {
                    this.isAttacking = false;
                }, 500); // Adjust this value based on how long your attack animation should play
            }
        }, 2000); // This is the interval for throwing bottles
    }

    /*throwBottles() {
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
    }*/

    /**
     * Animates the endboss.
     */
animateMovement() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        this.moveInterval = setInterval(() => {
            if (!this.isDead && !this.world.gameOver && !this.world.paused) {
                // Determine movement direction (patrolling)
                if (this.movementDirection === -1) { // Moving left
                    if (this.x > this.movementLimit) {
                        this.moveLeft();
                    } else {
                        // Reached left limit, turn around and move right
                        this.movementDirection = 1;
                    }
                } else { // Moving right
                    if (this.x < this.movementRightLimit) {
                        this.moveRight();
                    } else {
                        // Reached right limit, turn around and move left
                        this.movementDirection = -1;
                    }
                }

                // --- NEW LOGIC: Always face the player ---
                if (this.world.character.x < this.x) {
                    this.otherDirection = false; // Player is to the left, face left
                } else {
                    this.otherDirection = true; // Player is to the right, face right
                }
                // ------------------------------------------

            } else if (this.isDead || this.world.gameOver || this.world.paused) {
                this.speed = 0; // Stop movement if dead, game over, or paused
            }
        }, 1000 / 60); // Run at 60 FPS
    }


    /**
    * Animates the endboss's images.
    */
    animateImages() {
        if (this.animationInterval) clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            if (this.isDead) {
                if (!this.hasFallen) { this.playAnimation(this.Endboss_DEAD);
                } else {const lastFrame = this.Endboss_DEAD[this.Endboss_DEAD.length - 1];this.loadimage(lastFrame);
                }
            } else if (this.isHurtState) {this.playAnimation(this.ENDBOSS_HURT_IMAGES);
                if (Date.now() - this.hurtTimestamp > this.hurtDuration) {this.isHurtState = false; }
            } else if (this.isAttacking) { 
                this.playAnimation(this.ENDBOSS_ATTACK_IMAGES);
            }
            else { this.playAnimation(this.WALKING_IMAGES_ENDBOSS);  }
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
        if (this.energy > 0) { 
            this.isHurtState = true;
            this.hurtTimestamp = Date.now();
        }
        const maxEnergy = 400; 
        const newPercentage = (this.energy / maxEnergy) * 100;
        if (this.world && this.world.endbossHealthBar) {
            this.world.endbossHealthBar.setPercentage(newPercentage);  }        
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