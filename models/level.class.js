class Level {
    enemies;
    clouds;    
    backgroundobjects;
    collectibles; // <-- ADD this
    level_end_x = 2550;

    constructor(enemies, clouds, backgroundobjects, collectibles) { // <-- ADD collectibles here
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundobjects = backgroundobjects;
        this.collectibles = collectibles; 
    }
}
