/**
 * Represents a throwable object in the game, such as a bottle.
 * 
 * @class ThrowableObject
 * @extends moveableObject
 */
class ThrowableObject extends moveableObject {

    /**
     * Speed of the object flying forward.
     * 
     * @type {number}
     */
    speed = 3.5;

    /**
     * Strength of gravity affecting the object.
     * 
     * @type {number}
     */
    gravity = 0.5;

    /**
     * Initial speed of the object falling downward.
     * 
     * @type {number}
     */
    velocityY = 10;

    /**
     * Number of bottles collected.
     * 
     * @type {number}
     */
    bottleCount = 0;

    /**
     * Flag indicating whether the object is splashing.
     * 
     * @type {boolean}
     */
    isSplash = false;

    /**
     * Flag indicating whether the splash animation has started.
     * 
     * @type {boolean}
     */
    splashStarted = false;

    /**
     * Flag indicating whether the splash animation has finished.
     * 
     * @type {boolean}
     */
    finishedSplash = false;

    /**
     * Flag indicating whether the object has hit something.
     * 
     * @type {boolean}
     */
    hasHit = false;     
    
    /**
     * Array of image paths for the spinning bottle animation.
     * 
     * @type {string[]}
     */
    SPINNING_BOTTLE = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

     /**
     * Array of image paths for the splash animation.
     * 
     * @type {string[]}
     */
    SPLASH_BOTTLE = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

     /**
     * Creates a new ThrowableObject instance.
     * 
     * @param {number} x - The x-coordinate of the object.
     * @param {number} y - The y-coordinate of the object.
     * @param {boolean} otherDirection - The direction of the object.
     * @param {object} [owner=null] - The owner of the object.
     */    
    constructor(x, y, otherDirection, owner = null) {
        super();
        this.loadimage('img/img/6_salsa_bottle/bottle_rotation/rotation_sequences.gif');
        this.loadimages(this.SPINNING_BOTTLE);
        this.loadimages(this.SPLASH_BOTTLE);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 190;
        this.otherDirection = otherDirection;
        this.owner = owner;     
        this.animate();
    }

     /**
     * Collects a bottle and updates the bottle status bar.
     */
    collectBottle() {
       this.bottleCount += 1;
       world.bottleStatusBar.setPercentage(this.bottleCount * 20); 
    }

     /**
     * Applies gravity to the object.
     */
    applyGravity() {
        setInterval(() => {
            this.y += this.velocityY;
            this.velocityY += this.gravity;
        }, 1000 / 60); 
    }

    
    /**
     * Moves the object based on its direction.
     */
    move() {
        if (this.otherDirection) {
            this.x -= this.speed; 
        } else {
            this.x += this.speed;
        }
        
    }

    /**
     * Makes the object splash.
     */
    splash() {
        if (this.hasHit) return;        
        this.hasHit = true;
        this.speed = 0;
        this.velocityY = 0;
        clearInterval(this.gravityInterval);        
        this.isSplash = true;
        this.currentImage = 0; 
        this.finishedSplash = false; 
        
    }

    /**
     * Animates a single frame of the splash animation.
     */
   animateSplashFrame() {
       if (this.currentImage < this.SPLASH_BOTTLE.length) {
           const path = this.SPLASH_BOTTLE[this.currentImage];
           this.img = this.imageCache[path];
           this.currentImage++;
        } else {
           this.finishedSplash = true;
           clearInterval(this.animationInterval);
        }
    }

    /**
     * Animates a single frame of the spinning animation.
     */
    animateSpinningFrame() {
        if (this.currentImage >= this.SPINNING_BOTTLE.length) {
            this.currentImage = 0;
        }
           const path = this.SPINNING_BOTTLE[this.currentImage];
           this.img = this.imageCache[path];
           this.currentImage++;
    }

    /**
    * Animates the object.
    */

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isSplash) {
                this.animateSplashFrame();
            } else {
                this.animateSpinningFrame();
            }
        }, 100);
    }
}
