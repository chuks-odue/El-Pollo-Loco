// js/collision_manager.js

class CollisionManager {
    constructor(world) {
        // The CollisionManager needs access to the 'World' properties
        // like character, level, throwableObjects, statusBar, coinBar, bottleBar
        // so we pass the entire world instance to its constructor.
        this.world = world;
        this.collisionInterval = null; // To hold the setInterval ID
    }

    /**
     * Initializes the continuous collision checking.
     */
    startCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval); // Clear any existing interval
        }
        this.collisionInterval = setInterval(() => {
            // Check if the game is over or paused, and if so, stop checking
            if (this.world.gameOver || this.world.paused) {
                this.stopCollisionChecks(); // Stop the interval
                return;
            }

            // Call all collision-related methods, now using 'this' to refer
            // to the CollisionManager instance, and 'this.world' for World properties.
            this.checkEnemyCollision();
            this.checkCollectibleCollision();
            this.checkThrowableCollision();
            // ... potentially other collision checks
        }, 1000 / 60); // It's common to run collision checks at game's FPS, e.g., 60fps
    }

    /**
     * Stops the continuous collision checking.
     */
    stopCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

    // --- Move all your collision-related methods here ---

    checkEnemyCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.world.character.isColliding(enemy)) {
                if (this.world.character.y < enemy.y && this.world.character.speedY >= 0) {
                    enemy.die();
                    this.world.character.speedY = -10;
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

    checkCollectibleCollision() {
        // Use a loop that iterates backward when splicing elements to avoid skipping
        for (let i = this.world.level.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.world.level.collectibles[i];
            if (this.world.character.isColliding(collectible)) {
                if (collectible.type === 'coin') {
                    this.collectCoin(collectible, i); // Pass 'i' for the index
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

    collectCoin(collectible, index) {
        const character = this.world.character;
        const coinBar = this.world.coinBar;

        if (coinBar.percentage < 100) {
            coinBar.percentage += 20;
            if (coinBar.percentage > 100) {
                coinBar.percentage = 100;
            }
            coinBar.setPercentage(coinBar.percentage);
            this.world.playSound('coin'); // Still using world's playSound
            this.world.level.collectibles.splice(index, 1);
        } else {
            this.world.playSound('coin-lost');
        }
    }

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

    checkBottleEnemyCollision(bottle) {
        if (!bottle || typeof bottle !== 'object' || !('owner' in bottle)) return;

        this.world.level.enemies.forEach((enemy) => {
            const isBottleFromCharacter = bottle.owner instanceof Character; // Assuming Character is a global class
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

    checkBottleCharacterCollision(bottle) {
        if (!bottle || typeof bottle !== 'object') return;
        // Assuming Endboss is a global class
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

    removeFinishedBottles() {
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObjects[i];
            if (bottle.finishedSplash) {
                this.world.throwableObjects.splice(i, 1);
            }
        }
    }

    checkThrowableCollision() {
        // Iterate backwards when removing items from the array
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObjects[i];
            this.checkBottleEnemyCollision(bottle);
            this.checkBottleCharacterCollision(bottle);
        }
        this.removeFinishedBottles();
    }

    checkThrowBottle() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' && this.world.character.bottleCount > 0 && !this.world.gameOver && !this.world.paused) {
                this.world.throwBottle(); // Call method on the world instance
                this.world.playSound('throw');
            }
        });
        document.addEventListener('throwBottle', () => { // Assuming a custom event
            if (this.world.character.bottleCount > 0 && !this.world.gameOver && !this.world.paused) {
                this.world.throwBottle();
                this.world.playSound('throw');
            }
        });
    }
}