class Level {
    enemies;
    clouds;    
    backgroundobjects;
    collectibles; 
    level_end_x = 2550;

    constructor(enemies, clouds, backgroundobjects, collectibles) { 
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundobjects = backgroundobjects;
        this.collectibles = collectibles; 
    }
}
