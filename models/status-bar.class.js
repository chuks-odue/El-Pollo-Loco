class StatusBar extends DrawableObject {

    STATUS_IMAGES = [
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png', // This one is blue, others are green
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    COIN_BAR = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    STATUS_BOTTLE = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];
    Endboss_STATUSBAR = [
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
        
    ];

    percentage = 100; 
                      

    constructor(type = 'health') {
        super();
        this.type = type;
        let initialPercentage;

        if (this.type === 'health') {
            this.IMAGE_SET = this.STATUS_IMAGES;
            this.x = 20;
            this.y = 40;
            initialPercentage = 100;
        } else if (this.type === 'coin') {
            this.IMAGE_SET = this.COIN_BAR;
            this.x = 20;
            this.y = 80;
            initialPercentage = 0;
        } else if (this.type === 'bottle') {
            this.IMAGE_SET = this.STATUS_BOTTLE;
            this.x = 20;
            this.y = 0;
            initialPercentage = 100;
        }
        else if (this.type === 'endbossHealth') {
            this.IMAGE_SET = this.Endboss_STATUSBAR;
            this.x = 620; // Check this X position
            this.y = 50;  // Check this Y position
            initialPercentage = 100;
            // --- ADD THIS LOG ---
            console.log('StatusBar: Endboss Health Bar constructed. Initial Percentage:', initialPercentage, 'X:', this.x, 'Y:', this.y);
            // --------------------
        }

        this.width = 200;
        this.height = 35;

        this.loadimages(this.IMAGE_SET); // Make sure images are loaded
        this.setPercentage(initialPercentage); // Make sure initial image is set
    }

    setPercentage(percentage) {
        
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGE_SET[this.resolveImageIndex()];
        this.img = this.imageCache[path]; 
    }

    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}