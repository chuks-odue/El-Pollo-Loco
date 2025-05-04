class Endboss extends moveableObject {
    height = 400;
    width = 250;
    y = 59;
    energy = 300;
    isActivated = false;
    isDead = false;
    hasFallen = false; 

    WALKING_IMAGES_ENDBOSS = [
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    Endboss_DEAD = [
        'img/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadimage('img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadimages(this.WALKING_IMAGES_ENDBOSS);
        this.loadimages(this.Endboss_DEAD); // 💥 Load dead images too
        this.x = 2800;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
        this.throwBottles();
    }

    throwBottles() {
        this.bottleThrowInterval = setInterval(() => {
            
            if (!this.isDead && this.isActivated) {
                const isCharacterOnLeft = world.character.x < this.x;
                const bottle = new ThrowableObject(this.x, this.y + 50, isCharacterOnLeft, this); 
                world.throwableObjects.push(bottle);
            }
        }, 3000);
    }
    
    

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                if (!this.hasFallen) {
                    this.playAnimation(this.Endboss_DEAD); // Play animation while falling
                } else {
                    // Show final frame after landing
                    const lastFrame = this.Endboss_DEAD[this.Endboss_DEAD.length - 1];
                    this.loadimage(lastFrame);
                }
            } else {
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
        
        // Stop throwing bottles
        if (this.bottleThrowInterval) {
            clearInterval(this.bottleThrowInterval);
            this.bottleThrowInterval = null;
        }
        
        setTimeout(() => {
            this.startFalling(() => {
                world.showGameOverImage('win');
            });
        }, 2000);
    }    

    startFalling(callback) {
        this.fallInterval = setInterval(() => {
            if (this.y < 100) {
                this.y += 5;
            } else {
                clearInterval(this.fallInterval);
                this.hasFallen = true; 
                if (this.shouldShowWinImage) {
                    world.showGameOverImage('win');
                }
                callback(); 
            }
        }, 1000 / 30);
    }
}
