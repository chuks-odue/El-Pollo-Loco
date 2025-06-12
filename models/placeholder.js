class Endboss extends moveableObject {
    height = 400;
    width = 250;
    y = 59;
    energy = 300;
    isActivated = false;
    isDead = false;
    hasFallen = false; 
      canThrowBottles = false;


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
        this.originalSpeed = this.speed;
        this.animate();
      
    }
      throwBottles() {
    if (this.canThrowBottles) {
      this.bottleThrowInterval = setInterval(() => {
        if (!this.isDead && this.isActivated) {
          const isCharacterOnLeft = world.character.x < this.x;
          const bottle = new ThrowableObject(this.x, this.y + 50, isCharacterOnLeft, this); 
          world.throwableObjects.push(bottle);
        }
      }, 3000);
    }
  }

  
      checkActivation() {
    if (!this.isActivated && world.character.x > this.x - 1000 && world.character.x < this.x + 1000) {
      this.isActivated = true;
      this.canThrowBottles = true;
      this.throwBottles();
    }
  }

      moveInterval;
  animationInterval;

  animate() {
  if (this.moveInterval) {
    clearInterval(this.moveInterval);
  }
  if (this.animationInterval) {
    clearInterval(this.animationInterval);
  }
  if (this.activationInterval) {
    clearInterval(this.activationInterval);
  }

  this.moveInterval = setInterval(() => {
    if (!this.isDead && !world.gameOver && !world.paused) {
      this.moveLeft();
    }
  }, 1000 / 60);

  this.activationInterval = setInterval(() => {
    this.checkActivation();
  }, 100);

  this.animationInterval = setInterval(() => {
    if (this.isDead) {
      if (!this.hasFallen) {
        this.playAnimation(this.Endboss_DEAD);
      } else {
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
        if (this.bottleThrowInterval) {
            clearInterval(this.bottleThrowInterval);
            this.bottleThrowInterval = null;
        }        
        setTimeout(() => {
            this.startFalling();
        }, 2000);
    }    

    startFalling() {
        this.fallInterval = setInterval(() => {
            if (this.y < 150) {
                this.y += 5;
            } else {
                clearInterval(this.fallInterval);
                this.hasFallen = true; 
                world.showGameOverImage('win');
            }
        }, 1000 / 30);
    }
}



class Character extends moveableObject {
    width = 250;
    height = 250;
    y = 0;
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

    DEAD_IMAGES =[
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    HURT_IMAGES=[
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
    if  (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
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
  } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT && !this.world.gameOver) {
    this.playAnimation(this.WALKING_IMAGES);
  } else {
    this.loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
  }
}
    animate() {
       setInterval(() => {
           if (!this.world.gameOver) {
                this.updateMainGameLoop();
            } else {
               this.updateCamera();
            }
        }, 1000 / 60);
        setInterval(() => {
           this.updateAnimation();
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

    
}

