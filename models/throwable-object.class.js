class ThrowableObject extends moveableObject {
    speed = 5;         // Speed flying forward
    gravity = 0.5;      // Strength of gravity
    velocityY = 10;      // Speed falling downward
    bottleCount = 5; 
    isSplash = false; // 💥 to know if it's splashing
    splashStarted = false;

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
        this.owner = owner; // 👈 Add owner here
    
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


    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isSplash) {
                if (!this.splashStarted) {
                    this.splashStarted = true;
                    this.currentImage = 0;
                    console.log('Splash started');
                }
    
                if (this.currentImage < this.SPLASH_BOTTLE.length) {
                    const path = this.SPLASH_BOTTLE[this.currentImage];
                    this.img = this.imageCache[path];
                    console.log('Drawing splash image:', path);
                    this.currentImage++;
                } else {
                    console.log('Splash animation ended');
                    clearInterval(this.animationInterval);
                    this.img = this.imageCache[this.SPLASH_BOTTLE[this.SPLASH_BOTTLE.length - 1]];
                }
            } else {
                if (this.currentImage >= this.SPINNING_BOTTLE.length) {
                    this.currentImage = 0;
                }
                const path = this.SPINNING_BOTTLE[this.currentImage];
                this.img = this.imageCache[path];
                console.log('Drawing spinning bottle image:', path);
                this.currentImage++;
            }
        }, 100);
    }
    

    splash() {
        if (this.hasHit) return;
    
        this.hasHit = true;
        this.speed = 0;
        this.velocityY = 0;
        clearInterval(this.gravityInterval);
    
        this.isSplash = true;
        this.splashStarted = false;
        this.currentImage = 0; // <- Ensure this reset here too
        console.log('Splash triggered');
    }
    
    
  
    

    /*animate() {
        setInterval(() => {
            this.currentImage++;
            if (this.currentImage >= this.SPINNING_BOTTLE.length) {
                this.currentImage = 0;
            }
            let path = this.SPINNING_BOTTLE[this.currentImage];
            this.img = this.imageCache[path];
        }, 50); // Speed of rotation (100ms = fast spin)
    }*/
}
