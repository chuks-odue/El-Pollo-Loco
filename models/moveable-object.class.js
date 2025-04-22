class moveableObject{
    x =120;
    y =280;
    img;
    width= 100;
    height = 150;
    imsgeCache = {};
    currentImage = 0;
    speed=0.15;
    otherDirection= false;
    speedY = 0;
    acceleration = 2.5;

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


       loadimage(path){
        this.img = new Image() // same as saying this.img = document.getElementById('');
        this.img.src = path;
       }

       loadimages(arr){
        arr.forEach((path) => {
            let img =new Image();
            img.src = path;
            this.imsgeCache[path]=img;
    
            
        });
       }

       playAnimation(images){
        let i = this.currentImage % this.WALKING_IMAGES.length;
            let path = images[i];
            this.img = this.imsgeCache[path];
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