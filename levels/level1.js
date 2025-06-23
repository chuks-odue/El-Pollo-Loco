/**
 * The current level.
 * @type {Level}
 */
let level1;

/**
 * Initializes the level.
 */
function initLevel() {
    level1 = new Level(
        [
            /**
             * Enemies in the level.
             * @type {Array<Enemy>}
             */
            new chicken(world),
            new chicken(world),
            new chicken(world),
            new chicken(world),
            new chicken(world),
            new chicken(world),
            new SmallChicken(world),
            new SmallChicken(world),
            new SmallChicken(world),
            new Endboss(world),
        ],
        [
            /**
             * Clouds in the level.
             * @type {Array<Cloud>}
             */
            new Cloud()
        ],
        [
            /**
             * Background objects in the level.
             * @type {Array<BackgroundObject>}
             */
            new BackgroundObject('img/img/5_background/layers/air.png', -819),
            new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', -819),
            new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', -819),
            new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', -819),

            new BackgroundObject('img/img/5_background/layers/air.png', 0),
            new BackgroundObject('img/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/img/5_background/layers/air.png', 819),
            new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', 819),
            new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', 819),
            new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', 819),

            new BackgroundObject('img/img/5_background/layers/air.png', 819 * 2),
            new BackgroundObject('img/img/5_background/layers/3_third_layer/1.png', 819 * 2),
            new BackgroundObject('img/img/5_background/layers/2_second_layer/1.png', 819 * 2),
            new BackgroundObject('img/img/5_background/layers/1_first_layer/1.png', 819 * 2),

            new BackgroundObject('img/img/5_background/layers/air.png', 819 * 3),
            new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', 819 * 3),
            new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', 819 * 3),
            new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', 819 * 3),
        ],
        [
            /**
             * Collectibles in the level.
             * @type {Array<Collectible>}
             */
            new Collectible('coin', 10, 130),
            new Collectible('coin', 600, 150),
            new Collectible('coin', 900, 120),
            new Collectible('coin', 1300, 270),
            new Collectible('coin', 1700, 170),
            new Collectible('coin', 2000, 80),
            new Collectible('coin', 2200, 190),

            new Collectible('bottle', 50, 270),
            new Collectible('bottle', 210, 120),
            new Collectible('bottle', 350, 200),
            new Collectible('bottle', 550, 270),
            new Collectible('bottle', 900, 200),
            new Collectible('bottle', 1350, 300),
            new Collectible('bottle', 1750, 300),
            new Collectible('bottle', 2100, 110),
            new Collectible('bottle', 2300, 150),
            new Collectible('bottle', 2500, 50),

            new Collectible('life', 700, 280),
            new Collectible('life', 900, 100),
            new Collectible('life', 1800, 100),
            new Collectible('life', 1800, 100),
            new Collectible('life', 2300, 180),
            new Collectible('life', 2550, 250),
        ]
    );
}