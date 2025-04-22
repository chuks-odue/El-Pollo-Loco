class Character extends moveableObject{
   width=250;
   height=250;
   y=80;
   speed =10;
   WALKING_IMAGES = [
         
    'img/img/2_character_pepe/2_walk/W-21.png',
    'img/img/2_character_pepe/2_walk/W-22.png',
    'img/img/2_character_pepe/2_walk/W-23.png',
    'img/img/2_character_pepe/2_walk/W-24.png',
    'img/img/2_character_pepe/2_walk/W-25.png',
    'img/img/2_character_pepe/2_walk/W-26.png'

   ];
   JUMPING_IMAGES =[
    'img/img/2_character_pepe/3_jump/J-31.png',
    'img/img/2_character_pepe/3_jump/J-32.png',
    'img/img/2_character_pepe/3_jump/J-33.png',
    'img/img/2_character_pepe/3_jump/J-34.png',
    'img/img/2_character_pepe/3_jump/J-35.png',
    'img/img/2_character_pepe/3_jump/J-35.png',
    'img/img/2_character_pepe/3_jump/J-36.png',
    'img/img/2_character_pepe/3_jump/J-37.png',
    'img/img/2_character_pepe/3_jump/J-38.png',
    'img/img/2_character_pepe/3_jump/J-39.png',
    

   ];
  world;


    constructor(){
        super().loadimage('img/img/2_character_pepe/1_idle/idle/I-1.png');
       this.loadimages(this.WALKING_IMAGES);
       this.loadimages(this.JUMPING_IMAGES);
       this.applyGravity();
       this.animate();
    }
    animate(){
  setInterval(() => {
       if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
        this.otherDirection=false;
          this.moveRight();
        }
       if(this.world.keyboard.LEFT && this.x > 0){  
        this.otherDirection = true;        
        this.moveLeft();
        }
        if (this.world.keyboard.SPACE && ! this.isAboveGround()) {
            this.jump();            
        } 

       this.world.camera_x = -this.x + 100;
    
    }, 1000/60);

    setInterval(() => {
       if (this.isAboveGround()){
            this.playAnimation(this.JUMPING_IMAGES);

        }else{
            if(this.world.keyboard.RIGHT ||this.world.keyboard.LEFT ){
                //this.x += this.speed;
                this.playAnimation(this.WALKING_IMAGES);
            
            } 
        } 
        },50);
    }
    

   


    jump(){
    this.speedY = 50;

    }
}