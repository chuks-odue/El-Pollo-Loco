//button
class Button {
    x;
    y;
    width;
    height;
    ctx;
    icon;

    constructor(x, y, width, height, ctx, pausedIcon, playIcon) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.pausedIcon = pausedIcon;
        this.playIcon = playIcon;
        this.icon = this.pausedIcon;        
        this.backgroundColor = 'rgba(119, 0, 255, 0.7)';
        this.buttonColor = 'darkorange';
        this.padding = 5;
    }
    drawBackground() {
        this.ctx.fillStyle = 'rgba(119, 0, 255, 0.7)'; 
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    drawShape() {
       this.ctx.fillStyle = '#0c627a';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 5, this.y);
        this.ctx.lineTo(this.x + this.width - 5, this.y);
        this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + 5, 5);
        this.ctx.lineTo(this.x + this.width, this.y + this.height - 5);
        this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - 5, this.y + this.height, 5);
        this.ctx.lineTo(this.x + 5, this.y + this.height);
        this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - 5, 5);
        this.ctx.lineTo(this.x, this.y + 5);
        this.ctx.arcTo(this.x, this.y, this.x + 5, this.y, 5);
        this.ctx.fill();
    }

    drawIcon() {
       this.ctx.drawImage(this.icon, this.x + 10, this.y + 10, 20, 20);
    }

   draw() {
       this.drawBackground();
       this.drawShape();
       this.drawIcon();
    }

    handleClick(x, y, world) {
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
          if (world.paused) {
               world.resume();
               this.icon = world.pausedIcon;
               this.draw();
            } else {
               world.pause();
               this.icon = world.playIcon;
               this.draw();
            }
        }
    }

}
 //character
 class Character extends moveableObject {
    width = 250;
    height = 250;
    y = 0;
    speed = 10;
    bottleCount = 5; 
    world;


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

    updateAnimation() {
     if (this.isDead()) {
            this.playAnimation(this.DEAD_IMAGES);
        } else if (this.isHurt()) {
             this.playAnimation(this.HURT_IMAGES);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.JUMPING_IMAGES);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT && !this.world.gameOver) {
            this.playAnimation(this.WALKING_IMAGES);
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
//quit
class QuitButton {


    constructor(x, y, width, height, ctx, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.text = text;
        this.backgroundColor = 'rgba(119, 0, 255, 0.7)';
        this.buttonColor = '#0c627a';
        this.addEventListener();
    }
    
    addEventListener() {
       let self = this;
         document.addEventListener('click', (e) => {
            let rect = world.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
             self.handleClick(x, y, world);
          });
    }

    handleClick(x, y, world) {
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
         world.quitGame();
         console.log('Quit button clicked');
        }
    }  

  drawBackground() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
  }

  drawButton() {
    this.ctx.fillStyle = this.buttonColor;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + 5, this.y);
    this.ctx.lineTo(this.x + this.width - 5, this.y);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + 5, 5);
    this.ctx.lineTo(this.x + this.width, this.y + this.height - 5);
    this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - 5, this.y + this.height, 5);
    this.ctx.lineTo(this.x + 5, this.y + this.height);
    this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - 5, 5);
    this.ctx.lineTo(this.x, this.y + 5);
    this.ctx.arcTo(this.x, this.y, this.x + 5, this.y, 5);
    this.ctx.fill();
  }

  drawText() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  draw() {
    this.drawBackground();
    this.drawButton();
    this.drawText();
  }

}
//restart
class RestartButton {
    x;
    y;
    width;
    height;
    ctx;
    text;
    text;
    blinkTimer = 0; // Initialize blinkTimer
   isBlinking = false; // Initialize isBlinking
   

    



    constructor(x, y, width, height, ctx, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.text = text;
        this.isBlinking = false;
       setInterval(() => {
          this.isBlinking = !this.isBlinking;
        }, 100); 
    }

    updateBlink() {
    this.blinkTimer++;
    if (this.blinkTimer > 500) {
        this.isBlinking = !this.isBlinking;
        this.blinkTimer = 0;
    }
}

drawBackground() {
    this.ctx.fillStyle = 'rgba(119, 0, 255, 0.7)';
    this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
}

drawButton() {
    if (this.isBlinking) {
        this.ctx.fillStyle = 'orange';
    } else {
        this.ctx.fillStyle = '#0c727a';
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + 5, this.y);
    this.ctx.lineTo(this.x + this.width - 5, this.y);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + 5, 5);
    this.ctx.lineTo(this.x + this.width, this.y + this.height - 5);
    this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - 5, this.y + this.height, 5);
    this.ctx.lineTo(this.x + 5, this.y + this.height);
    this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - 5, 5);
    this.ctx.lineTo(this.x, this.y + 5);
    this.ctx.arcTo(this.x, this.y, this.x + 5, this.y, 5);
    this.ctx.fill();
}

drawText() {
    this.ctx.fillStyle = 'Black';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
}

draw() {
    this.updateBlink();
    this.drawBackground();
    this.drawButton();
    this.drawText();
}

    handleClick(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            replayGame();
        }
    }
}
//touch
class TouchControls {


    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.leftArrowIcon = new Image();
        this.leftArrowIcon.src = 'img/assets/chevron_left.svg';
        this.rightArrowIcon = new Image();
        this.rightArrowIcon.src = 'img/assets/keyboard_arrow_right.svg';
        this.upArrowIcon = new Image();
        this.upArrowIcon.src = 'img/assets/arrow-up-white.svg';
        this.throwIcon = new Image();
        this.throwIcon.src = 'img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    }

    drawLeftArrow() {
       this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
       this.ctx.beginPath();
       this.ctx.roundRect(28, this.canvas.height - 52, 40, 40, 10);
       this.ctx.fill();
       this.ctx.drawImage(this.leftArrowIcon, 22, this.canvas.height - 58, 50, 50);
    }

    drawRightArrow() {
       this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
       this.ctx.beginPath();
       this.ctx.roundRect(88, this.canvas.height - 52, 40, 40, 10);
       this.ctx.fill();
       this.ctx.drawImage(this.rightArrowIcon, 85, this.canvas.height - 58, 50, 50);
    }

    drawUpArrow() {
      this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
      this.ctx.beginPath();
      this.ctx.roundRect(this.canvas.width - 157, this.canvas.height - 52, 40, 40, 10);
      this.ctx.fill();
      this.ctx.drawImage(this.upArrowIcon, this.canvas.width - 163, this.canvas.height - 54, 50, 50);
    }

    drawThrowIcon() {
      this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
      this.ctx.beginPath();
      this.ctx.roundRect(this.canvas.width - 67, this.canvas.height - 52, 40, 40, 10);
      this.ctx.fill();
      this.ctx.drawImage(this.throwIcon, this.canvas.width - 70, this.canvas.height - 62, 50, 50);
    }

   draw() {
       this.drawLeftArrow();
       this.drawRightArrow();
       this.drawUpArrow();
       this.drawThrowIcon();
    }

    handleTouchStart(canvas, keyboard, x, y) {
    if (x > 12 && x < 82 && y > this.canvas.height - 70 && y < this.canvas.height) {
        keyboard.LEFT = true;
    } else if (x > 75 && x < 145 && y > this.canvas.height - 70 && y < this.canvas.height) {
        keyboard.RIGHT = true;
    } else if (x > this.canvas.width - 173 && x < this.canvas.width - 103 && y > this.canvas.height - 70 && y < this.canvas.height) {
        keyboard.UP = true;
    } else if (x > this.canvas.width - 95 && x < this.canvas.width - 25 && y > this.canvas.height - 70 && y < this.canvas.height) {
        const throwEvent = new CustomEvent('throwBottle');
        document.dispatchEvent(throwEvent);
    }
}

handleTouchEnd(keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
}

handleTouchEvents(canvas, keyboard) {
    canvas.addEventListener('touchstart', (event) => {
        let rect = canvas.getBoundingClientRect();
        let x = event.touches[0].clientX - rect.left;
        let y = event.touches[0].clientY - rect.top;
        this.handleTouchStart(canvas, keyboard, x, y);
    });

    canvas.addEventListener('touchend', () => {
        this.handleTouchEnd(keyboard);
    });
}

}
//throwable

class ThrowableObject extends moveableObject {
    speed = 5;      // Speed flying forward
    gravity = 0.5;    // Strength of gravity
    velocityY = 10;     // Speed falling downward
    bottleCount = 5; 
    isSplash = false; // 💥 to know if it's splashing
    splashStarted = false;
    finishedSplash = false;
    hasHit = false;

    SPINNING_BOTTLE = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    SPLASH_BOTTLE = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    
    constructor(x, y, otherDirection, owner = null) {
        super();
        this.loadimage('img/img/6_salsa_bottle/bottle_rotation/rotation_sequences.gif');
        this.loadimages(this.SPINNING_BOTTLE);
        this.loadimages(this.SPLASH_BOTTLE);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 190;
        this.otherDirection = otherDirection;
        this.owner = owner; 
    
        this.animate();
    }
    

    applyGravity() {
        setInterval(() => {
            this.y += this.velocityY;
            this.velocityY += this.gravity;
        }, 1000 / 60); 
    }

    move() {
        if (this.otherDirection) {
            this.x -= this.speed; 
        } else {
            this.x += this.speed;
        }
        
    }

    splash() {
        if (this.hasHit) return;
        
        this.hasHit = true;
        this.speed = 0;
        this.velocityY = 0;
        clearInterval(this.gravityInterval);
        
        this.isSplash = true;
        this.currentImage = 0; 
        this.finishedSplash = false; // Reset finishedSplash
        
    }

   animateSplashFrame() {
    if (this.currentImage < this.SPLASH_BOTTLE.length) {
        const path = this.SPLASH_BOTTLE[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
    } else {
        this.finishedSplash = true;
        clearInterval(this.animationInterval);
    }
}

animateSpinningFrame() {
    if (this.currentImage >= this.SPINNING_BOTTLE.length) {
        this.currentImage = 0;
    }
    const path = this.SPINNING_BOTTLE[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
}

animate() {
    this.animationInterval = setInterval(() => {
        if (this.isSplash) {
            this.animateSplashFrame();
        } else {
            this.animateSpinningFrame();
        }
    }, 100);
}
}
//moveable
class moveableObject extends DrawableObject{
   
    speed=0.15;
    otherDirection= false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround()|| this.speedY > 0) {                           
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
            
        }, 1000/25);
    }
    
    isAboveGround(){
        return this.y < 180;
    }  
    isColliding(mo) {
        let thisRect = {
            x: this.x + (this.width * 0.1), y: this.y + (this.height * 0.1), 
            width: this.width * 0.8, height: this.height * 0.8 
        };    
        let moRect = {
            x: mo.x + (mo.width * 0.1), y: mo.y + (mo.height * 0.1),
            width: mo.width * 0.8, height: mo.height * 0.8
        };    
        return  thisRect.x + thisRect.width > moRect.x &&
                thisRect.x < moRect.x + moRect.width &&
                thisRect.y + thisRect.height > moRect.y &&
                thisRect.y < moRect.y + moRect.height;
    }        
    
  hit(){
    if (new Date().getTime() - this.lastHit > 500) { 
        this.energy -= 20;
        if (this.energy < 0) { this.energy = 0;}
        this.lastHit = new Date().getTime();
        this.world.coinBar.percentage -= 20;
        if (this.world.coinBar.percentage < 0) {this.world.coinBar.percentage = 0;}
        this.world.coinBar.setPercentage(this.world.coinBar.percentage);
        let droppedCoin = new DroppedCoin(this.x, this.y);
        droppedCoin.world = this.world;
        this.world.droppedCoins.push(droppedCoin);
        this.world.playSound('coin-lost');
    }
   }

                    
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
         timepassed = timepassed / 1000;
         return timepassed < 1;

    }

    isDead(){
            return this.energy ==0;
    }


    playAnimation(images){
        let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;

    }


    moveRight(){
        this.x += this.speed
    }
       
    moveLeft(){
        this.x-= this.speed;
            
       

    }

    jump(){
        this.speedY = 50;
    }

    
       
   
}
//drawable
class DrawableObject{
    x =120;
    y =280;
    img;
    width= 100;
    height = 150;
    imageCache = {};
    currentImage = 0;
    


    loadimage(path){
        this.img = new Image() 
        this.img.src = path;
    }

    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        
    }
    

    loadimages(arr){
        arr.forEach((path) => {
            let img =new Image();
            img.src = path;
            this.imageCache[path]=img;
    
            
        });
    }

    drawFrame(ctx){
   
    }


}
//collectible
class Collectible extends moveableObject {

    blinkTimer = 0;
    isVisible = true;

    setInitialState(x, y) {
      this.x = x;
      this.y = y;
    }

   initializeType() {
    if (this.type === 'coin') {
          this.loadimage('img/img/8_coin/coin_1.png');
          this.width = 110;
          this.height = 110;
        } else if (this.type === 'bottle') {
          this.loadimage('img/img/6_salsa_bottle/salsa_bottle.png');
          this.width = 60;
          this.height = 60;
        } else if (this.type === 'life') {
          this.loadimage('img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
          this.width = 60;
          this.height = 60;
        }
    }

   constructor(type, x, y) {
      super();
       this.type = type;
       this.setInitialState(x, y);
       this.initializeType();
    }

    draw(ctx) {
      if (this.isVisible) {
            super.draw(ctx);
        }
        if (this.type === 'coin') {
            this.blinkTimer++;
            if (this.blinkTimer > 10) {
                this.isVisible = !this.isVisible;
                this.blinkTimer = 0;
            }
        }
    }

}
//keyboard
class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    DOWN = false;
    UP = false;
    D = false;

    touchStartX = 0;

    constructor() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.LEFT = true;
                    break;
                case 'ArrowRight':
                    this.RIGHT = true;
                    break;
                case ' ':
                    this.SPACE = true;
                    break;
                case 'ArrowDown':
                    this.DOWN = true;
                    break;
                case 'ArrowUp':
                    this.UP = true;
                    break;
                case 'd':
                    this.throwBottle();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.LEFT = false;
                    break;
                case 'ArrowRight':
                    this.RIGHT = false;
                    break;
                case ' ':
                    this.SPACE = false;
                    break;
                case 'ArrowDown':
                    this.DOWN = false;
                    break;
                case 'ArrowUp':
                    this.UP = false;
                    break;
            }
        });

        document.addEventListener('touchmove', (event) => {
            let touchMoveX = event.touches[0].clientX;
            if (touchMoveX < this.touchStartX - 10) {
                this.LEFT = true;
                this.RIGHT = false;
            } else if (touchMoveX > this.touchStartX + 10) {
                this.RIGHT = true;
                this.LEFT = false;
            }
        });

        document.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
        });

        document.addEventListener('touchend', () => {
            this.LEFT = false;
            this.RIGHT = false;
        });

        
    }   

    throwBottle() {
        
        this.D = true;
        setTimeout(() => {
            this.D = false;
        }, 100);
    }
}
//drop-coin
class DroppedCoin extends moveableObject {
    constructor(x, y, world) {
        super();
        this.world = world;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speedY = 5;
        this.loadimage('img/img/8_coin/coin_1.png');
    }

    update() {
        this.y += this.speedY;
        if (this.y > 380 - this.height) {
            this.y = 380 - this.height;
            this.world.droppedCoins.splice(this.world.droppedCoins.indexOf(this), 1);
        }
    }
}
//game


























































let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

// Initialize game
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); 
    world = new World(canvas, keyboard);
    world.soundEnabled = soundEnabled;
    console.log('my character is', world.character);
}

function replayGame() {
  if (world && typeof world.stop === 'function') {
    world.stop(); 
  }

  keyboard = new Keyboard();   
  initLevel();                 
  world = new World(canvas, keyboard); 

  world.gameOver = false;
  world.gameOverImageShown = false;
  world.soundEnabled = soundEnabled;
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    let canvas; 
    function startGame() {
        console.log('Starting game, sound enabled:', soundEnabled);

        if (soundEnabled) {
            const startSound = new Audio('audio/S31-Winning the Race.ogg');
            startSound.volume = 0.5;
            startSound.play().catch(err => console.error('Failed to play start sound:', err));        
            setTimeout(() => {
                startSound.pause();
                startSound.currentTime = 0;
            }, 3000);     
        }
        
        document.body.classList.add('game-started');
        
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.style.display = 'none';
            canvas = document.getElementById('canvas'); 
            if (canvas) canvas.style.display = 'block';
        } else {
            canvas = document.getElementById('canvas'); 
            if (canvas) canvas.style.display = 'block';
        }
        
        const h1 = document.querySelector('h1');
        if (h1) h1.style.display = 'none'; 
        
        const playPauseControls = document.getElementById('play-pause-controls');
        if (playPauseControls) playPauseControls.style.display = 'block';        

        init();

        if (canvas) {
            canvas.addEventListener('click', (e) => {
                let rect = canvas.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;
                if (world.gameOver) {
                    world.restartButton.handleClick(x, y);
                } else {
                    world.playPauseButton.handleClick(x, y, world);
                }
            });
        }
    }
    startButton.addEventListener('click', () => {
        startGame();
    });
});

// ... rest of your code
// Keydown event listener
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowDown") keyboard.DOWN = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key.toLowerCase() === 'd') keyboard.D = true;
});

// Keyup event listener
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === "ArrowDown") keyboard.DOWN = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key.toLowerCase() === 'd') keyboard.D = false;
});

// (Optional but unused) custom event listener — can be removed if not used elsewhere
window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');
    const closeInfoOverlay = document.getElementById('closeInfoOverlay');
    let isInfoOverlayVisible = false;

    if (infoButton) {
        infoButton.addEventListener('click', () => {
            isInfoOverlayVisible = !isInfoOverlayVisible;
            infoOverlay.style.display = isInfoOverlayVisible ? 'block' : 'none';
        });
    }

    if (closeInfoOverlay) {
        closeInfoOverlay.addEventListener('click', () => {
            infoOverlay.style.display = 'none';
            isInfoOverlayVisible = false;
        });
    }

    document.addEventListener('click', (event) => {
        if (isInfoOverlayVisible && !infoOverlay.contains(event.target) && event.target !== infoButton) {
            infoOverlay.style.display = 'none';
            isInfoOverlayVisible = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const soundButtonInGame = document.getElementById('soundButtonInGame');
    const soundIconInGame = document.getElementById('soundIconInGame');
    const gameContainer = document.querySelector('.game-container'); // Changed to container
    const canvas = document.getElementById('canvas');

    // Fullscreen functionality
    function toggleFullscreen() {
        if (!isFullscreen()) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }

    function isFullscreen() {
        // Check if game container is the fullscreen element
        return !!(
            document.fullscreenElement === gameContainer ||
            document.webkitFullscreenElement === gameContainer ||
            document.mozFullScreenElement === gameContainer ||
            document.msFullscreenElement === gameContainer
        );
    }

    function enterFullscreen() {
        try {
            if (gameContainer.requestFullscreen) { // Changed to gameContainer
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) {
                gameContainer.mozRequestFullScreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen failed:', error);
        }
    }

    function exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } catch (error) {
            console.error('Exit fullscreen failed:', error);
        }
    }

    function updateFullscreenIcon() {
        const iconPath = isFullscreen() 
            ? 'img/assets/fullscreen_exit.svg'
            : 'img/assets/fullscreen_icon.svg';
        
        // Verify icon exists before setting source
        fetch(iconPath)
            .then(response => {
                if (response.ok) {
                    fullscreenIcon.src = iconPath;
                } else {
                    console.error('Icon not found:', iconPath);
                }
            })
            .catch(error => console.error('Icon fetch error:', error));
    }

    // Event listeners
    fullscreenButton.addEventListener('click', toggleFullscreen);
    
    // Fullscreen change events
    [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ].forEach(event => {
        document.addEventListener(event, updateFullscreenIcon);
    });

    // Initial setup
    updateFullscreenIcon();

    soundButtonInGame.addEventListener('click', (e) => {
    soundEnabled = !soundEnabled;
    if (world) {
        world.soundEnabled = soundEnabled;
    }
    console.log('Sound enabled:', soundEnabled);
    soundIconInGame.src = soundEnabled 
        ? 'img/assets/Mic-On.svg' 
        : 'img/assets/Mic-Off.svg';
    e.stopPropagation();
});
});
