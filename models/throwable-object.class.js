class ThrowableObject extends moveableObject {
    speed = 10;         // Speed flying forward
    gravity = 0.5;      // Strength of gravity
    velocityY = 0;      // Speed falling downward
    bottleCount = 5; 

    SPINNING_BOTTLE = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    
    constructor(x, y, otherDirection) {
        super();
        this.loadimage('img/img/6_salsa_bottle/bottle_rotation/rotation_sequences.gif'); // KEEP THIS
        this.loadimages(this.SPINNING_BOTTLE); // ALSO load images
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 180;
        this.otherDirection = otherDirection;

        //this.applyGravity();
        this.animate(); // <-- JUST ADD THIS
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
        setInterval(() => {
            this.currentImage++;
            if (this.currentImage >= this.SPINNING_BOTTLE.length) {
                this.currentImage = 0;
            }
            let path = this.SPINNING_BOTTLE[this.currentImage];
            this.img = this.imsgeCache[path];
        }, 50); // Speed of rotation (100ms = fast spin)
    }
}
