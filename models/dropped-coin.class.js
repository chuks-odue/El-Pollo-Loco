/**
 * Represents a dropped coin object in the game.
 * @extends moveableObject
 */
class DroppedCoin extends moveableObject {
    /**
     * Creates a new dropped coin.
     * @param {number} x The x-coordinate of the coin.
     * @param {number} y The y-coordinate of the coin.
     * @param {World} world The world object.
     */
    constructor(x, y, world) {
        super();
        this.world = world;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speedY = 5;
        this.loadimage('img/img/8_coin/coin_1.png');
    }

    /**
     * Updates the position of the dropped coin.
     */
    update() {
        this.y += this.speedY;
        if (this.y > 380 - this.height) {
            this.y = 380 - this.height;
            this.world.droppedCoins.splice(this.world.droppedCoins.indexOf(this), 1);
        }
    }
}