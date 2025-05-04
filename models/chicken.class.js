class chicken extends moveableObject {
    y = 380;
    height = 60;
    width = 80;
    energy = 100; // 💥 add energy
    isDead = false; // 💥 to check if chicken is dead

    WALKING_IMAGES = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    DEAD_IMAGE = 'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'; 

    constructor() {
        super().loadimage('img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.x = 400 + Math.random() * 700;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) { 
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead) { 
                this.playAnimation(this.WALKING_IMAGES);
            }
        }, 200);
    }

    hit() {
        this.energy -= 100; 
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.loadimage(this.DEAD_IMAGE); 
    
        setTimeout(() => {
            const index = world.level.enemies.indexOf(this);
            if (index > -1) {
                world.level.enemies.splice(index, 1); 
            }
        }, 2000); 
    }
    

}
