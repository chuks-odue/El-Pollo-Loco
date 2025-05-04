class DrawableObject{
    x =120;
    y =280;
    img;
    width= 100;
    height = 150;
    imageCache = {};
    currentImage = 0;
    


    loadimage(path){
        this.img = new Image() // same as saying this.img = document.getElementById('');
        this.img.src = path;
    }

    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        
    }
    

    loadimages(arr){
        arr.forEach((path) => {
            let img =new Image();
            img.src = path;
            this.imageCache[path]=img;
    
            
        });
    }

    drawFrame(ctx){
   
    }


}