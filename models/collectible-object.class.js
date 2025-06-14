class Collectible extends moveableObject {

    blinkTimer = 0;
    isVisible = true;

    setInitialState(x, y) {
      this.x = x;
      this.y = y;
    }

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
          this.loadimage('img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png');
          this.width = 60;
          this.height = 60;
        }
    }

   constructor(type, x, y) {
      super();
       this.type = type;
       this.setInitialState(x, y);
       this.initializeType();
    }

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
