/**
 * Represents a chicken enemy in the game.
 * @extends moveableObject
 */
class chicken extends moveableObject {
  /**
     * The y-coordinate of the chicken.
     * @type {number}
     */
    y = 380;
    
    /**
     * The height of the chicken.
     * @type {number}
     */
    height = 60;

        /**
     * The width of the chicken.
     * @type {number}
     */
    width = 80;

        /**
     * The energy of the chicken.
     * @type {number}
     */
    energy = 100; 

        /**
     * Flag to track whether the chicken is dead.
     * @type {boolean}
     */
    isDead = false; 

    /**
     * The interval IDs for movement and animation.
     * @type {number}
     */
    moveInterval;
    animationInterval;


     /**
     * The walking images of the chicken.
     * @type {string[]}
     */
    WALKING_IMAGES = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

        /**
     * The dead image of the chicken.
     * @type {string}
     */
    DEAD_IMAGE = 'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'; 


    /**
     * Creates a new chicken enemy.
     * @param {World} world The world object.
     */
    constructor(world) {
        super().loadimage('img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.x = 400 + Math.random() * 1900;
        this.speed = 0.15 + Math.random() * 0.3;
        this.originalSpeed = this.speed;
                this.collisionOffset = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this.animate();
        this.world = world;
    }

     /**
     * Animates the chicken.
     */  
  animate() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval); }
    if (this.animationInterval) {clearInterval(this.animationInterval);}
    this.moveInterval = setInterval(() => {
      if (!this.isDead && !this.world.gameOver && !this.world.paused) { 
        this.moveLeft();
      }
    }, 1000 / 60);
        this.animationInterval = setInterval(() => {
      if (!this.isDead && !this.world.gameOver && !this.world.paused) { 
        this.playAnimation(this.WALKING_IMAGES);
      }
    }, 200);
  }

    /**
     * Handles a hit event.
     */
    hit() {
        this.energy -= 100; 
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
        this.loadimage(this.DEAD_IMAGE); 
    
        setTimeout(() => {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1); 
            }
        }, 2000); 
    }
    

}
//done