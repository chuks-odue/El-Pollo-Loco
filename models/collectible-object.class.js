class Collectible extends moveableObject {
    constructor(type, x, y) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;

        if (type === 'coin') {
            this.loadimage('img/img/8_coin/coin_1.png');
        } else if (type === 'bottle') {
            this.loadimage('img/img/6_salsa_bottle/salsa_bottle.png');
        } else if (type === 'life') {
            this.loadimage('img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
        }
    }
}
