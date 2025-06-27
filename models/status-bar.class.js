/**
 * Represents a status bar in the game, such as health, coins, or bottles.
 * 
 * @class StatusBar
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    
    /**
     * Array of image paths for the health status bar.
     * 
     * @type {string[]}
     */
    STATUS_IMAGES = [
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png', 
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
    /**
     * Array of image paths for the coin status bar.
     * 
     * @type {string[]}
     */
    COIN_BAR = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

     /**
     * Array of image paths for the bottle status bar.
     * 
     * @type {string[]}
     */
    STATUS_BOTTLE = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

     /**
     * Array of image paths for the endboss health status bar.
     * 
     * @type {string[]}
     */
    Endboss_STATUSBAR = [
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
        
    ];

     /**
     * The initial percentage value of the status bar.
     * 
     * @type {number}
     */
    percentage = 0; 
                      
    /**
    * Creates a new StatusBar instance.
    * 
    * @param {string} [type='health'] - The type of status bar to create (health, coin, bottle, or endbossHealth).
    */
    constructor(type = 'health') {
       super();
       this.type = type;
       this.initializeStatusBar();
    }

   /**
   * Initializes the status bar based on its type.
   */
   initializeStatusBar() {
      this.setImageSet();
      this.setPosition();
       this.setInitialPercentage();
       this.setSize();
       this.loadimages(this.IMAGE_SET);
       this.setPercentage(this.initialPercentage);
    }

   /**
    * Sets the image set for the status bar based on its type.
    */
    setImageSet() {
       if (this.type === 'health') {
           this.IMAGE_SET = this.STATUS_IMAGES;
        } else if (this.type === 'coin') {
           this.IMAGE_SET = this.COIN_BAR;
        } else if (this.type === 'bottle') {
            this.IMAGE_SET = this.STATUS_BOTTLE;
        } else if (this.type === 'endbossHealth') {
            this.IMAGE_SET = this.Endboss_STATUSBAR;
        }
    }

    /**
    * Sets the position of the status bar based on its type.
    */
    setPosition() {
       if (this.type === 'health') {
           this.x = 20;
           this.y = 40;
        } else if (this.type === 'coin') {
           this.x = 20;
            this.y = 80;
        } else if (this.type === 'bottle') {
           this.x = 20;
           this.y = 0;
        } else if (this.type === 'endbossHealth') {
           this.x = 620;
           this.y = 50;
        }
    }

   /**
    * Sets the initial percentage value of the status bar based on its type.
    */
    setInitialPercentage() {
       if (this.type === 'health' || this.type === 'endbossHealth') {
           this.initialPercentage = 100;
        } else {
           this.initialPercentage = 0;
        }
    }

   /**
    * Sets the size of the status bar.
    */
   setSize() {
       this.width = 200;
       this.height = 35;
    }
    /**
     * Sets the percentage value of the status bar.
     * 
     * @param {number} percentage - The new percentage value.
     */
    setPercentage(percentage) {
        
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGE_SET[this.resolveImageIndex()];
        this.img = this.imageCache[path]; 
    }

    /**
     * Resolves the index of the image to display based on the current percentage value.
     * 
     * @returns {number} The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}