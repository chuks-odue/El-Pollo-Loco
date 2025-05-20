class SmallChicken extends moveableObject {
    y = 400;
    width = 40;
    height = 40;
    speed = 0.2 + Math.random() * 0.3; // random speed between 0.2 and 0.5
    energy = 50; // energy for the small chicken
    isDead = false; // to check if small chicken is dead
    speedY = 0;

    WALKING_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    DEAD_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    constructor() {
        super().loadimage('img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.x = 400 + Math.random() * 700; 
        this.originalSpeed = this.speed;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
                this.updatePosition();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead && Math.random() < 0.05) { 
                this.jump();
            }
        }, 1000/60); 

        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.DEAD_IMAGES);
            } else {
                this.playAnimation(this.WALKING_IMAGES);
            }
        }, 200);
    }

    jump() {
        if (this.y >= 380) {
            this.speedY = -20; 
        }
    }

    updatePosition() {
        this.y += this.speedY;
        if (this.y < 400) {
            this.speedY += 1;
        } else {
            this.y = 400;
            this.speedY = 0;
        }
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    hit() {
        this.energy -= 50;
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.loadimage(this.DEAD_IMAGES);

        setTimeout(() => {
            const index = world.level.enemies.indexOf(this);
            if (index > -1) {
                world.level.enemies.splice(index, 1);
            }
        }, 2000);
    }
}