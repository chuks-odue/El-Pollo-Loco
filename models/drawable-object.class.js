class DrawableObject{
    x =120;
    y =280;
    img;
    width= 100;
    height = 150;
    imsgeCache = {};
    currentImage = 0;
    


    loadimage(path){
        this.img = new Image() // same as saying this.img = document.getElementById('');
        this.img.src = path;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadimages(arr){
        arr.forEach((path) => {
            let img =new Image();
            img.src = path;
            this.imsgeCache[path]=img;
    
            
        });
    }

    drawFrame(ctx){
   
    }


}