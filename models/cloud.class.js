/**
 * Represents a cloud object in the game.
 * @extends moveableObject
 */
class Cloud extends moveableObject {
    /**
     * The y-coordinate of the cloud.
     * @type {number}
     */
    y = 50;

    /**
     * The width of the cloud.
     * @type {number}
     */
    width = 500;

    /**
     * The height of the cloud.
     * @type {number}
     */
    height = 250;

    /**
     * Creates a new cloud object.
     */
    constructor() {
        super().loadimage('img/img/5_background/layers/4_clouds/1.png');
        this.x = 50 + Math.random() * 500;
        this.animate();
    }

    /**
     * Animates the cloud by moving it to the left.
     */
    animate() {
        this.moveLeft();
    }
}