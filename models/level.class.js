class Level {

     /**
     * The enemies in the level.
     * @type {Enemy[]}
     */
    enemies;

    /**
     * The clouds in the level.
     * @type {Cloud[]}
     */
    clouds; 
    
    /**
     * The background objects in the level.
     * @type {BackgroundObject[]}
     */
    backgroundobjects;

    /**
     * The collectibles in the level.
     * @type {Collectible[]}
     */
    collectibles;
     /**
     * The x-coordinate of the end of the level.
     * @type {number}
     */ 
    level_end_x = 2550;


    /**
     * Creates a new level.
     * @param {Enemy[]} enemies The enemies in the level.
     * @param {Cloud[]} clouds The clouds in the level.
     * @param {BackgroundObject[]} backgroundobjects The background objects in the level.
     * @param {Collectible[]} collectibles The collectibles in the level.
     */
    constructor(enemies, clouds, backgroundobjects, collectibles) { 
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundobjects = backgroundobjects;
        this.collectibles = collectibles; 
    }
}
