class DroppedCoin extends moveableObject {
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

    update() {
        this.y += this.speedY;
        if (this.y > 380 - this.height) {
            this.y = 380 - this.height;
            this.world.droppedCoins.splice(this.world.droppedCoins.indexOf(this), 1);
        }
    }
}
//*