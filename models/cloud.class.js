/**
 * Represents a cloud object in the game.
 * @extends moveableObject
 */
class Cloud extends moveableObject {
   
    y = 50;   
    width = 500;    
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