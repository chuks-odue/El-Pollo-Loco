class Character extends moveableObject {
    width = 120;
    height = 240;
    y = 30;
    speed = 10;
    bottleCount = 5;
    world;
    isHurtState = false;
    hurtTimestamp = 0;
    hurtDuration = 700;

    WALKING_IMAGES = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'
    ];

    JUMPING_IMAGES = [
        'img/img/2_character_pepe/3_jump/J-31.png',
        'img/img/2_character_pepe/3_jump/J-32.png',
        'img/img/2_character_pepe/3_jump/J-33.png',
        'img/img/2_character_pepe/3_jump/J-34.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-36.png',
        'img/img/2_character_pepe/3_jump/J-37.png',
        'img/img/2_character_pepe/3_jump/J-38.png',
        'img/img/2_character_pepe/3_jump/J-39.png'
    ];

    DEAD_IMAGES = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    HURT_IMAGES = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    sounds = {
        walk: new Audio('audio/concrete-footsteps-6752.mp3'),
        jump: new Audio('audio/slime_jump.mp3'),
        hurt: new Audio('audio/5.ogg'),
    };

    constructor() {
        super().loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.loadimages(this.JUMPING_IMAGES);
        this.loadimages(this.DEAD_IMAGES);
        this.loadimages(this.HURT_IMAGES);
        this.sounds.walk.loop = true;
        this.applyGravity();
        this.animate();
    }

    updateMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
            this.playWalkingSound();
        } else if (this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }

    updateJumping() {
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            this.playSound('jump');
        }
    }

    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    updateMainGameLoop() {
        if (!this.world.gameOver) {
            this.updateMovement();
            this.updateJumping();
            this.updateCamera();
        } else {
            this.stopWalkingSound();
        }
    }

    bounce() {
        this.speedY = -20;
    }

    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.DEAD_IMAGES);
        } else if (this.isHurt()) {
            this.playAnimation(this.HURT_IMAGES);
            if (Date.now() - this.hurtTimestamp > this.hurtDuration) {
                this.isHurtState = false;
            }
        } else if (this.isAboveGround()) {
            this.playAnimation(this.JUMPING_IMAGES);
        } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.world.gameOver) {
            this.playAnimation(this.WALKING_IMAGES);
        } else {
            this.loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        }
    }

    animate() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);

        this.moveInterval = setInterval(() => {
            this.updateMainGameLoop();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.world.gameOver) {
                this.updateAnimation();
            } else if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGES);
                if (this.currentImage % this.DEAD_IMAGES.length === this.DEAD_IMAGES.length - 1) {
                    this.stopAnimation();
                    this.loadimage(this.DEAD_IMAGES[this.DEAD_IMAGES.length - 1]);
                }
            } else {
                this.stopAnimation();
            }
        }, 50);
    }

    playWalkingSound() {
        if (soundEnabled && this.sounds.walk.paused) {
            this.sounds.walk.play();
        }
    }

    stopWalkingSound() {
        if (!this.sounds.walk.paused) {
            this.sounds.walk.pause();
            this.sounds.walk.currentTime = 0;
        }
    }

    playSound(name) {
        if (soundEnabled) {
            const sound = this.sounds[name];
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        }
    }

    jump() {
        this.speedY = 50;
        if (soundEnabled) {
            this.playSound('jump');
        }
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}