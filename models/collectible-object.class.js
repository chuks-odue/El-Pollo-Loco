/**
 * Represents a collectible object in the game.
 * @extends moveableObject
 */
class Collectible extends moveableObject {    
    blinkTimer = 0;    
    isVisible = true;

    /**
     * Sets the initial state of the collectible.
     * @param {number} x The x-coordinate of the collectible.
     * @param {number} y The y-coordinate of the collectible.
     */
    setInitialState(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Initializes the type of the collectible.
     */
    initializeType() {
        if (this.type === 'coin') {
            this.loadimage('img/img/8_coin/coin_1.png');
            this.width = 110;
            this.height = 110;
        } else if (this.type === 'bottle') {
            this.loadimage('img/img/6_salsa_bottle/salsa_bottle.png');
            this.width = 60;
            this.height = 60;
        } else if (this.type === 'life') {
            this.loadimage('img/img/7_statusbars/3_icons/icon_health.png');
            this.width = 60;
            this.height = 60;
        }
    }

    /**
     * Creates a new collectible.
     * @param {string} type The type of the collectible (coin, bottle, or life).
     * @param {number} x The x-coordinate of the collectible.
     * @param {number} y The y-coordinate of the collectible.
     */
    constructor(type, x, y) {
        super();
        this.type = type;
        this.setInitialState(x, y);
        this.initializeType();
    }

    /**
     * Draws the collectible on the canvas.
     * @param {CanvasRenderingContext2D} ctx The 2D drawing context of the canvas.
     */
    draw(ctx) {
        if (this.isVisible) {
            super.draw(ctx);
        }
        if (this.type === 'coin') {
            this.blinkTimer++;
            if (this.blinkTimer > 10) {
                this.isVisible = !this.isVisible;
                this.blinkTimer = 0;
            }
        }
    }
}