class QuitButton {
       /**
     * Creates a new quit button.
     * @param {number} x The x-coordinate of the button.
     * @param {number} y The y-coordinate of the button.
     * @param {number} width The width of the button.
     * @param {number} height The height of the button.
     * @param {CanvasRenderingContext2D} ctx The 2D drawing context of the canvas.
     * @param {string} text The text to display on the button.
     */
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

      /**
     * Handles a click event on the button.
     * @param {number} x The x-coordinate of the click.
     * @param {number} y The y-coordinate of the click.
     * @param {World} world The world object.
     */
    handleClick(x, y, world) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            world.quitGame();
            console.log('Quit button clicked');
        }
    }

    /**
     * Draws the background of the button.
     */
    drawBackground() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

     /**
     * Draws the button itself.
     */
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

    /**
     * Draws the text on the button.
     */
    drawText() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    /**
     * Draws the entire button.
     */
    draw() {
        this.drawBackground();
        this.drawButton();
        this.drawText();
    }
}