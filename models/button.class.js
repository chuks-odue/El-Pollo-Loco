/**
 * Represents a button on the canvas.
 */
class Button {
    /**
     * The x-coordinate of the button.
     * @type {number}
     */
    x;

    /**
     * The y-coordinate of the button.
     * @type {number}
     */
    y;

    /**
     * The width of the button.
     * @type {number}
     */
    width;

    /**
     * The height of the button.
     * @type {number}
     */
    height;

    /**
     * The 2D drawing context of the canvas.
     * @type {CanvasRenderingContext2D}
     */
    ctx;

    /**
     * The icon to be displayed on the button.
     * @type {HTMLImageElement}
     */
    icon;

    /**
     * Creates a new button.
     * @param {number} x The x-coordinate of the button.
     * @param {number} y The y-coordinate of the button.
     * @param {number} width The width of the button.
     * @param {number} height The height of the button.
     * @param {CanvasRenderingContext2D} ctx The 2D drawing context of the canvas.
     * @param {HTMLImageElement} pausedIcon The icon to be displayed when the game is paused.
     * @param {HTMLImageElement} playIcon The icon to be displayed when the game is playing.
     */
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

    /**
     * Draws the background of the button.
     */
    drawBackground() {
        this.ctx.fillStyle = 'rgba(119, 0, 255, 0.7)'; 
        this.ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    }

    /**
     * Draws the shape of the button.
     */
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

    /**
     * Draws the icon on the button.
     */
    drawIcon() {
       this.ctx.drawImage(this.icon, this.x + 10, this.y + 10, 20, 20);
    }

    /**
     * Draws the button.
     */
    draw() {
       this.drawBackground();
       this.drawShape();
       this.drawIcon();
    }

    /**
     * Handles a click event on the button.
     * @param {number} x The x-coordinate of the click.
     * @param {number} y The y-coordinate of the click.
     * @param {World} world The game world.
     */
   handleClick(x, y, world) {
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
        if (world && world.gameLifecycleManager) {
            if (world.paused) {
                world.gameLifecycleManager.resume();
                this.icon = this.pausedIcon; // When game resumes, show 'pause' icon (because it's now playing)
            } else {
                world.gameLifecycleManager.pause();
                this.icon = this.playIcon; // When game pauses, show 'play' icon (because it's now paused)
            }
            this.draw();
        } else {
            console.error("GameLifecycleManager not available on world object!");
        }
    }
}
}