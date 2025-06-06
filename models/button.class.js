class Button {
    x;
    y;
    width;
    height;
    ctx;
    icon;

    constructor(x, y, width, height, ctx, pausedIcon, playIcon) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.pausedIcon = pausedIcon;
        this.playIcon = playIcon;
        this.icon = this.pausedIcon;        
        this.backgroundColor = 'rgba(119, 0, 255, 0.7)';
        this.buttonColor = 'darkorange';
        this.padding = 5;
    }
    drawBackground() {
        this.ctx.fillStyle = 'rgba(119, 0, 255, 0.7)'; 
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    drawShape() {
       this.ctx.fillStyle = '#0c627a';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 5, this.y);
        this.ctx.lineTo(this.x + this.width - 5, this.y);
        this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + 5, 5);
        this.ctx.lineTo(this.x + this.width, this.y + this.height - 5);
        this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - 5, this.y + this.height, 5);
        this.ctx.lineTo(this.x + 5, this.y + this.height);
        this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - 5, 5);
        this.ctx.lineTo(this.x, this.y + 5);
        this.ctx.arcTo(this.x, this.y, this.x + 5, this.y, 5);
        this.ctx.fill();
    }

    drawIcon() {
       this.ctx.drawImage(this.icon, this.x + 10, this.y + 10, 20, 20);
    }

   draw() {
       this.drawBackground();
       this.drawShape();
       this.drawIcon();
    }

    handleClick(x, y, world) {
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
          if (world.paused) {
               world.resume();
               this.icon = world.pausedIcon;
               this.draw();
            } else {
               world.pause();
               this.icon = world.playIcon;
               this.draw();
            }
        }
    }
    

}