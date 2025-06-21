/**
 * Represents a drawable object in the game.
 */
class DrawableObject {
    /**
     * The x-coordinate of the object.
     * @type {number}
     */
    x = 120;

    /**
     * The y-coordinate of the object.
     * @type {number}
     */
    y = 280;

    /**
     * The image of the object.
     * @type {HTMLImageElement}
     */
    img;

    /**
     * The width of the object.
     * @type {number}
     */
    width = 100;

    /**
     * The height of the object.
     * @type {number}
     */
    height = 150;

    /**
     * A cache of images.
     * @type {Object<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * The current image index.
     * @type {number}
     */
    currentImage = 0;

    /**
     * Loads an image from a path.
     * @param {string} path The path to the image.
     */
    loadimage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx The 2D drawing context of the canvas.
     */
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads multiple images from an array of paths.
     * @param {string[]} arr An array of image paths.
     */
    loadimages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws a frame of the object (not implemented).
     * @param {CanvasRenderingContext2D} ctx The 2D drawing context of the canvas.
     */
    drawFrame(ctx) {
    }
}