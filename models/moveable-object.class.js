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
            x: this.x + 50, // adjust the x position of the rectangle
            y: this.y + 50, // adjust the y position of the rectangle
            width: this.width - 100, // adjust the width of the rectangle
            height: this.height - 100 // adjust the height of the rectangle
        };
    
        let moRect = {
            x: mo.x,
            y: mo.y,
            width: mo.width,
            height: mo.height
        };
    
        return  thisRect.x + thisRect.width > moRect.x &&
                thisRect.x < moRect.x + moRect.width &&
                thisRect.y + thisRect.height > moRect.y &&
                thisRect.y < moRect.y + moRect.height;
    }


        
    /*isColliding (mo) {
            return  this.x + this.width > mo.x &&  
                    this.y + this.height > mo.y  &&
                    this.x < mo.x &&
                    this.y < mo.y + mo.height
    
    }*/
   hit(){
    if (new Date().getTime() - this.lastHit > 500) { 
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;                
        }
        this.lastHit = new Date().getTime();
        this.world.coinBar.percentage -= 20;
        if (this.world.coinBar.percentage < 0) {
            this.world.coinBar.percentage = 0;
        }
        this.world.coinBar.setPercentage(this.world.coinBar.percentage);
        //this.world.playSound('coin-lost');
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