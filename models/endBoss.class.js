class Endboss extends moveableObject{
    height = 400;
    width = 250;
    y = 59;
    


    WALKING_IMAGES = [
        'img/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor(){
        super().loadimage('img/img/4_enemie_boss_chicken/2_alert/G5.png', );
        this.loadimages(this.WALKING_IMAGES);
        
        this.x = 2800;
        this.animate();
        
    }
     animate(){
        this.moveLeft();
        setInterval(() => {
            this.playAnimation(this.WALKING_IMAGES);
            
        }, 200);
     }
}