class QuitButton {
    constructor(x, y, width, height, ctx, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.text = text;
        this.backgroundColor = 'rgba(119, 0, 255, 0.7)';
        this.buttonColor = '#0c627a';
    }

    handleClick(x, y, world) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            world.quitGame();
            console.log('Quit button clicked');
        }
    }

    drawBackground() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    drawButton() {
        this.ctx.fillStyle = this.buttonColor;
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

    drawText() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    draw() {
        this.drawBackground();
        this.drawButton();
        this.drawText();
    }
}