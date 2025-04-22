class chicken extends moveableObject{
   y=380;
   height=60;
   width=80;
   WALKING_IMAGES =[
    'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
   ];

    constructor(){
        super().loadimage('img/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadimages(this.WALKING_IMAGES);
        this.x =200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();

        
    }
    animate(){
        setInterval(() => {
            this.moveLeft()
        }, 1000/60);
        ;
        setInterval(() => {
            this.playAnimation(this.WALKING_IMAGES);
            
        }, 200);
    }

   



}