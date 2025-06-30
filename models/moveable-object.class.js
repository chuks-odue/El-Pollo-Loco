/**
 * Represents a generic moveable object in the game, providing base properties and behaviors
 * for entities that can move, be affected by gravity, collide, and have health.
 * @extends DrawableObject
 */
class moveableObject extends DrawableObject{   
    speed=0.15;
    otherDirection= false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    moveInterval = null;
    animationInterval = null;
    bottleThrowInterval = null; 
    fallInterval = null;  
    groundLevel = 420; 
    
    /**
     * Defines offsets from the object's image boundaries to determine its actual collision box.
     * @type {object}
     * @property {number} top - Offset from the top edge.
     * @property {number} bottom - Offset from the bottom edge.
     * @property {number} left - Offset from the left edge.
     * @property {number} right - Offset from the right edge.
     */
    collisionOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Applies gravity to the object, causing it to fall when in the air.
     * This method sets up an interval that continuously updates the object's vertical position (`y`)
     * and vertical speed (`speedY`) based on acceleration.
     * The object stops falling when its collision bottom reaches the `groundLevel`.
     * @returns {void}
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            const collisionBottomY = this.y + this.height - (this.collisionOffset?.bottom || 0);

            if (this.speedY > 0 || collisionBottomY < this.groundLevel) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.groundLevel - (this.height - (this.collisionOffset?.bottom || 0));
                this.speedY = 0;
            }
        }, 1000 / 25); 
    } 
    
     /**
     * Checks if the object is currently above its defined ground level.
     * This is determined by comparing the object's collision bottom to the `groundLevel`.
     * @returns {boolean} True if the object is above ground, false otherwise.
     */
    isAboveGround() {

        const collisionBottomY = this.y + this.height - (this.collisionOffset?.bottom || 0);
        return collisionBottomY < this.groundLevel;
    }

        /**
     * Calculates and returns the object's current collision box based on its position, dimensions, and offsets.
     * @returns {object} An object with `x`, `y`, `width`, and `height` properties representing the collision box.
     */    
    getCollisionBox() {
        return {
            x: this.x + this.collisionOffset.left,
            y: this.y + this.collisionOffset.top,
            width: this.width - this.collisionOffset.left - this.collisionOffset.right,
            height: this.height - this.collisionOffset.top - this.collisionOffset.bottom
        };
    }

     /**
     * Checks if this object is currently colliding with another moveable object.
     * Collision is determined by checking the overlap of their respective collision boxes.
     * @param {moveableObject} mo - The other moveable object to check collision against.
     * @returns {boolean} True if a collision is detected, false otherwise.
     */
    isColliding(mo) {
        const thisBox = this.getCollisionBox();
        const moBox = mo.getCollisionBox();

        return (
            thisBox.x < moBox.x + moBox.width &&
            thisBox.x + thisBox.width > moBox.x &&
            thisBox.y < moBox.y + moBox.height &&
            thisBox.y + thisBox.height > moBox.y
        );
    }

     /**
     * Applies damage to the object, reducing its energy.
     * Includes a cooldown period (`lastHit`) to prevent rapid, continuous damage.
     * If the object is a `Character`, it also handles coin loss and dropping.
     * @param {number} [damage=20] - The amount of energy to reduce. Defaults to 20.
     * @returns {void}
     */
      hit(damage = 20) {
        if (new Date().getTime() - this.lastHit > 500) {
            this.energy -= damage;
            if (this.energy < 0) this.energy = 0;
            this.lastHit = new Date().getTime();            
            if (this instanceof Character) {
                this.world.coinBar.percentage -= 20;
                if (this.world.coinBar.percentage < 0) {
                    this.world.coinBar.percentage = 0;
                }
                this.world.coinBar.setPercentage(this.world.coinBar.percentage);

                let droppedCoin = new DroppedCoin(this.x, this.y);
                droppedCoin.world = this.world;
                this.world.droppedCoins.push(droppedCoin);
                this.world.playSound('coin-lost');
            }
        }
    }

     /**
     * Checks if the object is currently in a "hurt" state (i.e., recently hit).
     * @returns {boolean} True if the object was hit within the last 1 second, false otherwise.
     */                               
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
         timepassed = timepassed / 1000;
         return timepassed < 1;

    }

     /**
     * Checks if the object's energy has reached zero, indicating it is dead.
     * @returns {boolean} True if energy is 0, false otherwise.
     */
    isDead(){
            return this.energy ==0;
    }

        /**
     * Updates the object's current image for animation based on a provided array of image paths.
     * Cycles through the images to create an animation effect.
     * @param {string[]} images - An array of image paths for the animation.
     * @returns {void}
     */
    playAnimation(images){
        let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;

    }

    /**
     * Moves the object horizontally to the right by its `speed`.
     * @returns {void}
     */
    moveRight(){
        this.x += this.speed
    }

    /**
     * Moves the object horizontally to the left by its `speed`.
     * @returns {void}
     */       
    moveLeft(){
        this.x-= this.speed;
    }

    /**
     * Initiates an upward jump for the object by setting its vertical speed (`speedY`).
     * @returns {void}
     */
    jump(){
        this.speedY = 50;
    }

    /**
     * Clears all active intervals associated with this moveable object.
     * This includes animation, movement, gravity, bottle throwing, and falling intervals.
     * @returns {void}
     */
    clearAllIntervals() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval); this.animationInterval = null;
        }
        if (this.moveInterval) { clearInterval(this.moveInterval); this.moveInterval = null; }
        if (this.gravityInterval) {clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }        
        if (this.bottleThrowInterval) {clearInterval(this.bottleThrowInterval);
            this.bottleThrowInterval = null;
        }
        if (this.fallInterval) {  clearInterval(this.fallInterval);
            this.fallInterval = null;
        }        
    }    
}