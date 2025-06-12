class moveableObject extends DrawableObject{
   
    speed=0.15;
    otherDirection= false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
        moveInterval = null;
    animationInterval = null;
    bottleThrowInterval = null; 
    fallInterval = null;        


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

        clearAllIntervals() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        if (this.bottleThrowInterval) {
            clearInterval(this.bottleThrowInterval);
            this.bottleThrowInterval = null;
        }
        if (this.fallInterval) {
            clearInterval(this.fallInterval);
            this.fallInterval = null;
        }
        

    }

       
   
}