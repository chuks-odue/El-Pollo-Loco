class BackgroundObject extends  moveableObject{



     width=820;
     height=480;
    constructor(imagePath, x,y){
        super(). loadimage(imagePath);
        this.x=x;
        this.y= 480-this.height;

    }     
        
    

}