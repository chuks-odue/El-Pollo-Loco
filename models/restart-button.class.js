class RestartButton {
    x;
    y;
    width;
    height;
    ctx;
    text;

    constructor(x, y, width, height, ctx, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.text = text;
    }

   draw() {
    // Draw the background
    this.ctx.fillStyle = 'black'; // purple background
    this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);

    // Draw the button with rounded corners
    this.ctx.fillStyle = 'darkorange';
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

    // Draw the text
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'Black';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
}

    handleClick(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            restartGame();
        }
    }
}