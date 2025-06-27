class Level {    
    enemies;    
    clouds;     
    backgroundobjects;    
    collectibles;    
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
