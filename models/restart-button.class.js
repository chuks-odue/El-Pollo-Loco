/**
 * Represents a restart button.
 */
class RestartButton {

    x;    
    y;
    width;
    height;    
    ctx;
    text;    
    blinkTimer = 0;
    isBlinking = false;

    /**
     * Creates a new restart button.
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
        this.isBlinking = false;
        setInterval(() => {
            this.isBlinking = !this.isBlinking;
        }, 100);
    }

    /**
     * Updates the blink state of the button.
     */
    updateBlink() {
        this.blinkTimer++;
        if (this.blinkTimer > 500) {
            this.isBlinking = !this.isBlinking;
            this.blinkTimer = 0;
        }
    }

    /**
     * Draws the background of the button.
     */
    drawBackground() {
        this.ctx.fillStyle = 'rgba(119, 0, 255, 0.7)';
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    /**
     * Draws the button itself.
     */
    drawButton() {
        if (this.isBlinking) {
            this.ctx.fillStyle = 'orange';
        } else {
            this.ctx.fillStyle = '#0c727a';
        }
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
        this.ctx.fillStyle = 'Black';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    /**
     * Draws the entire button.
     */
    draw() {
        this.updateBlink();
        this.drawBackground();
        this.drawButton();
        this.drawText();
    }

    /**
     * Handles a click event on the button.
     * @param {number} x The x-coordinate of the click.
     * @param {number} y The y-coordinate of the click.
     */
    handleClick(x, y) {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
            replayGame();
        }
    }
}