class CollisionManager {
    /**
   * Creates a new instance of the CollisionManager class.
   * @param {World} world - The game world.
   */
    constructor(world) {
        this.world = world;
        this.collisionInterval = null;
    }

     /**
   * Initializes the continuous collision checking.
   * Starts an interval that checks for collisions between game objects.
   */    
    startCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval); 
        }
        this.collisionInterval = setInterval(() => {
            if (this.world.gameOver || this.world.paused) {
                this.stopCollisionChecks();  return;
            }              
            this.checkEnemyCollision();
            this.checkCollectibleCollision();
            this.checkThrowableCollision();

        }, 1000 / 60); 
    }

    /**
   * Stops the continuous collision checking.
   * Clears the interval that checks for collisions.
   */
    stopCollisionChecks() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }

      /**
   * Checks for collisions between the character and enemies.
   * If a collision is detected, the enemy is either killed or the character is hit.
   */
/**
 * Checks for collisions with enemies, handling "stomp" and "hurt" logic separately.
 */
checkEnemyCollision() {
    this.world.level.enemies.forEach((enemy) => {
        // First, make sure the enemy is alive and the player is touching it.
        if (!enemy.isDead && this.world.character.isColliding(enemy)) {            
            const isFalling = this.world.character.speedY < 0;
            if (isFalling) {            
                enemy.die(); 
                jumpAfterEnemyBounce() ;               
                return; 
            }
            this.world.character.hit();
            this.world.statusBar.setPercentage(this.world.character.energy);
            if (this.world.character.energy <= 0) {
                this.world.showGameOverImage('lose');
            }
        }
    });
}
    /**
   * Checks for collisions between the character and collectibles.
   * If a collision is detected, the collectible is removed and the character's status is updated.
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
   * Collects a coin and updates the character's coin status.
   * @param {Collectible} collectible - The coin collectible.
   * @param {number} index - The index of the collectible in the level's collectibles array.
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
   * Collects a bottle and updates the character's bottle status.
   * @param {Collectible} collectible - The bottle collectible.
   * @param {number} index - The index of the collectible in the level's collectibles array.
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
   * Collects a life and updates the character's health status.
   * @param {Collectible} collectible - The life collectible.
   * @param {number} index - The index of the collectible in the level's collectibles array.
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
   * Checks for collisions between throwables and enemies.
   * If a collision is detected, the enemy is hit and the throwable is removed.
   * @param {Throwable} bottle - The throwable object.
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
   * Checks for collisions between throwables and the character.
   * If a collision is detected, the character is hit and the throwable is removed from.
   * @param {Throwable} bottle - The throwable object.
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
   * Removes finished throwable objects from the game world.
   */
    removeFinishedBottles() {
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.world.throwableObjects[i];
            if (bottle.finishedSplash) {
                this.world.throwableObjects.splice(i, 1);
            }
        }
    }
    

    checkThrowableCollision() {
    
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