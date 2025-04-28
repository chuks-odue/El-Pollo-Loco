class Endboss extends moveableObject {
    height = 400;
    width = 250;
    y = 59;
    energy = 300; 
    isActivated = false; 
    isDead = false; 

    WALKING_IMAGES_ENDBOSS = [
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    constructor() {
        super().loadimage( 'img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadimages(this.WALKING_IMAGES_ENDBOSS);
        this.x = 2800;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
    animate() {
        setInterval(() => {
            if (!this.isActivated && !this.isDead) { 
                this.moveLeft();
            }
        }, 1000/60);

        setInterval(() => {
            if (!this.isDead) { 
                this.playAnimation(this.WALKING_IMAGES_ENDBOSS);
            }
        }, 200);
    }



    hit() {
        this.energy -= 100;
        if (!this.isActivated) {
            this.isActivated = true; 
        }
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        setTimeout(() => {
            const index = world.level.enemies.indexOf(this);
            if (index > -1) {
                world.level.enemies.splice(index, 1); 
            }
        }, 2000); 
    }
}
