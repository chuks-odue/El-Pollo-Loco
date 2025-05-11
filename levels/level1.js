let level1;

function initLevel() {
    level1 = new Level(
        [
            new chicken(),
            new chicken(),
            new chicken(),
            new chicken(),
            new chicken(),
            new chicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new Endboss(),
        ],
        [
            new Cloud()
        ],
        [
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
            new Collectible('coin', 400, 200),
            new Collectible('coin', 700, 150),
            new Collectible('coin', 1100, 120),
            new Collectible('coin', 1700, 270),
            new Collectible('coin', 2100, 210),

            new Collectible('bottle', 550, 270),
            new Collectible('bottle', 900, 200),
            new Collectible('bottle', 1350, 300),
            new Collectible('bottle', 1750, 300),
            new Collectible('bottle', 2300, 150),

            new Collectible('life', 700, 280),
            new Collectible('life', 900, 100),
            new Collectible('life', 1800, 100),
            new Collectible('life', 1800, 100),
            new Collectible('life', 2550, 250),
        ]
    );
}
