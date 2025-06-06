class Cloud extends moveableObject{
    y=50;
   width=500;
   height=250;

    constructor(){
        super().loadimage('img/img/5_background/layers/4_clouds/1.png');
        this.x =50 + Math.random() * 500;
      this.animate();
    }
     animate(){
        this.moveLeft();
    
    }
     

}
