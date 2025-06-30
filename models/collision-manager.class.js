/**
 * Manages all collision detection logic within the game world.
 * This includes collisions between the character and enemies, collectibles, and throwable objects.
 * @class
 */
class CollisionManager {
    /**
     * Creates an instance of CollisionManager.
     * @param {World} world - The game world instance.
     */
    constructor(world) {
        this.world = world;
        this.collisionInterval = null;
    }

    /**
     * Initializes and starts the continuous collision checking loop.
     * Clears any existing interval before starting a new one.
     */
    startCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
        }
        this.collisionInterval = setInterval(() => {
            if (this.world.gameOver || this.world.paused) {
                this.stopCollisionChecks();
                return;
            }
            this.checkEnemyCollision();
            this.checkCollectibleCollision();
            this.checkThrowableCollision();
        }, 1000 / 60);
    }

    /**
     * Stops the continuous collision checking loop.
     * Clears the active interval.
     */
    stopCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

   /**
     * Checks for collisions between the character and all active enemies.
     * Determines if the collision is a "stomp" (enemy dies, character bounces)
     * or a regular hit (character takes damage).
     */
    checkEnemyCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.world.character.isColliding(enemy)) {
                if (enemy instanceof chicken && this.world.character.isFallingOn(enemy)) {
                   this.world.playSound('stomp'); 
                    enemy.die();                    
                    this.world.character.jumpAfterEnemyBounce();
                } else {
                    this.world.character.hit();
                    this.world.statusBar.setPercentage(this.world.character.energy);
                    if (this.world.character.energy <= 0) {
                        this.world.showGameOverImage('lose');
                    }
                }
            }
        });
    }

    /**
     * Checks for collisions between the character and all active collectibles.
     * Collects the item if a collision is detected.
     */
    checkCollectibleCollision() {
        for (let i = this.world.level.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.world.level.collectibles[i];
            if (this.world.character.isColliding(collectible)) {
                if (collectible.type === 'coin') {
                    this.collectCoin(collectible, i);
                } else if (collectible.type === 'bottle') {
                    this.collectBottle(collectible, i);
                } else if (collectible.type === 'life') {
                    this.collectLife(collectible, i);
                } else {
                    this.world.level.collectibles.splice(i, 1);
                }
            }
        }
    }

    /**
     * Handles the collection of a coin.
     * Increases the coin bar percentage and plays a sound.
     * @param {Object} collectible - The coin object.
     * @param {number} index - The index of the coin in the collectibles array.
     */
    collectCoin(collectible, index) {
        const character = this.world.character;
        const coinBar = this.world.coinBar;
        if (coinBar.percentage < 100) {
            coinBar.percentage += 20;
            if (coinBar.percentage > 100) {
                coinBar.percentage = 100;
            }
            coinBar.setPercentage(coinBar.percentage);
            this.world.playSound('coin');
            this.world.level.collectibles.splice(index, 1);
        } else {
            this.world.playSound('coin-lost');
        }
    }

     /**
     * Handles the collection of a bottle.
     * Increases the character's bottle count and updates the bottle bar.
     * @param {Object} collectible - The bottle object.
     * @param {number} index - The index of the bottle in the collectibles array.
     */
    collectBottle(collectible, index) {
        const character = this.world.character;
        const bottleBar = this.world.bottleBar;
        if (character.bottleCount < 5) {
            character.bottleCount++;
            bottleBar.setPercentage(character.bottleCount * 20);
            this.world.level.collectibles.splice(index, 1);
            this.world.playSound('collect-bottle');
        }
    }

    /**
     * Handles the collection of a life (health potion).
     * Increases the character's energy and updates the status bar.
     * @param {Object} collectible - The life object.
     * @param {number} index - The index of the life in the collectibles array.
     */
    collectLife(collectible, index) {
        const character = this.world.character;
        const statusBar = this.world.statusBar;
        if (character.energy < 100) {
            character.energy += 20;
            if (character.energy > 100) {
                character.energy = 100;
            }
            statusBar.setPercentage(character.energy);
            this.world.level.collectibles.splice(index, 1);
            this.world.playSound('collect-life');
        }
    }

    /**
     * Checks for collisions between a throwable bottle and enemies.
     * If a collision occurs, the enemy takes damage, the bottle splashes, and a sound plays.
     * @param {ThrowableObject} bottle - The throwable bottle object.
     */
    checkBottleEnemyCollision(bottle) {
        if (!bottle || typeof bottle !== 'object' || !('owner' in bottle)) return;
        this.world.level.enemies.forEach((enemy) => {
            const isBottleFromCharacter = bottle.owner instanceof Character;
            if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
                if (isBottleFromCharacter && !(enemy instanceof Character)) {
                    bottle.splash();
                    bottle.hasHit = true;
                    enemy.hit();
                    this.world.playSound('explode');
                }
            }
        });
    }

     /**
     * Checks for collisions between a throwable bottle (specifically from an Endboss) and the character.
     * If a collision occurs, the character takes damage, the bottle splashes, and sound/game over is handled.
     * @param {ThrowableObject} bottle - The throwable bottle object.
     */
    checkBottleCharacterCollision(bottle) {
        if (!bottle || typeof bottle !== 'object') return;
        if (bottle.owner instanceof Endboss && bottle.isColliding(this.world.character) && !bottle.hasHit) {
            bottle.splash();
            bottle.hasHit = true;
            this.world.character.hit();
            this.world.playSound('bottle-hit');
            this.world.statusBar.setPercentage(this.world.character.energy);
            if (this.world.character.energy <= 0) {
                this.world.showGameOverImage('lose');
            }
        }
    }

    /**
     * Removes throwable bottles from the game world once their splash animation is finished.
     */
    removeFinishedBottles() {
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObjects[i];
            if (bottle.finishedSplash) {
                this.world.throwableObjects.splice(i, 1);
            }
        }
    }

     /**
     * Iterates through all active throwable objects and checks for relevant collisions
     * with enemies or the character, then removes finished bottles.
     */
    checkThrowableCollision() {
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObjects[i];
            this.checkBottleEnemyCollision(bottle);
            this.checkBottleCharacterCollision(bottle);
        }
        this.removeFinishedBottles();
    }

     /**
     * Sets up event listeners for throwing bottles (e.g., 'd' key press or custom 'throwBottle' event).
     * Triggers the throw action if conditions are met (character has bottles, game not over/paused).
     */
    checkThrowBottle() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' && this.world.character.bottleCount > 0 && !this.world.gameOver && !this.world.paused) {
                this.world.throwBottle();
                this.world.playSound('throw');
            }
        });
        document.addEventListener('throwBottle', () => {
            if (this.world.character.bottleCount > 0 && !this.world.gameOver && !this.world.paused) {
                this.world.throwBottle();
                this.world.playSound('throw');
            }
        });
    }
}