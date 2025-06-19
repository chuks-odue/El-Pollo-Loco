class SmallChicken extends moveableObject {
    y = 400;
    width = 40;
    height = 40;
    speed = 0.2 + Math.random() * 0.3;
    energy = 50;
    isDead = false;
    speedY = 0;
    moveInterval;
    jumpInterval;
    animationInterval;

    WALKING_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    DEAD_IMAGES = [
        'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    constructor(world) {
        super().loadimage('img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.x = 400 + Math.random() * 700;
        this.originalSpeed = this.speed;
        this.world = world;
        this.animate();
    }

    animate() {
        this.clearAnimationIntervals();
        this.startMovement();
        this.startJumping();
        this.startAnimationLoop();
    }

    clearAnimationIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.jumpInterval) clearInterval(this.jumpInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
    }

    startMovement() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead && !world.gameOver && !world.paused) {
                this.moveLeft();
                this.updatePosition();
            }
        }, 1000 / 60);
    }

    startJumping() {
        this.jumpInterval = setInterval(() => {
            if (!this.isDead && !world.gameOver && !world.paused && Math.random() < 0.05) {
                this.jump();
            }
        }, 1000 / 60);
    }

    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
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
