

class GameLifecycleManager {
    /**
     * @type {World} The World instance this manager is responsible for.
     */
    world;

    /**
     * Creates an instance of GameLifecycleManager.
     * @param {World} world The world object to manage.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Pauses the game by setting the paused flag and calling the stop() method.
     * @returns {void}
     */
    pause() {
        this.world.paused = true;
        this.stop(); 
    }

    /**
     * Resumes the game by unsetting the paused flag and restarting game elements.
     * This is an arrow function to preserve 'this' context.
     * @returns {void}
     */
    resume = () => {
        this.world.paused = false;
        this.resumeCharacter();
        this.resumeEnemies();
        this.resumeClouds();
        this.resumeThrowableObjects();
        this.startAnimation();
        this.startCollisionDetection();
        this.world.character.applyGravity(); 
    }

    /**
     * Resumes character animations and sets its speed.
     * @returns {void}
     */
    resumeCharacter() {
                if (this.world.character) {
            this.world.character.animate();
            if (this.world.character.originalSpeed) {
                this.world.character.speed = this.world.character.originalSpeed;
            }
        }
    }

    /**
     * Resumes enemy animations and sets their speed.
     * @returns {void}
     */
    resumeEnemies() {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy) {
                if (enemy.originalSpeed) {enemy.speed = enemy.originalSpeed;
                }                
                if (enemy.moveInterval) {
                    clearInterval(enemy.moveInterval); enemy.moveInterval = null;
                }
                if (enemy.animationInterval) {
                    clearInterval(enemy.animationInterval); enemy.animationInterval = null;
                }if (enemy instanceof Endboss) {
                      enemy.throwBottles();  }  enemy.animate(); 
            }
        });
    }

    /**
     * Resumes cloud animations.
     * @returns {void}
     */
    resumeClouds() {
        this.world.level.clouds.forEach((cloud) => {
            if (cloud) {
                cloud.animate(); 
            }
        });
    }

    /**
     * Resumes throwable object animations and gravity.
     * @returns {void}
     */
    resumeThrowableObjects() {
        this.world.throwableObjects.forEach((bottle) => {
            if (bottle) {
                if (!bottle.animationInterval) { 
                    bottle.animate();
                }
                if (!bottle.gravityInterval && !bottle.hasHit) { 
                    bottle.applyGravity();
                }
            }
        });
    }

    /**
     * Starts the main animation loop (requestAnimationFrame).
     * @returns {void}
     */
    startAnimation() {
        if (!this.world.animationFrameId) {
            this.world.draw(); 
        }
    }

    /**
     * Starts collision detection via the CollisionManager.
     * @returns {void}
     */
    startCollisionDetection() {
        if (this.world.collisionManager) {
            this.world.collisionManager.startCollisionChecks();
        } else {
            console.error("CollisionManager not initialized! Cannot start collision detection.");
        }
    }

    /**
     * Handles the display of the game over image and calls stop() to halt game activity.
     * @param {string} result 'win' or 'lose' indicating the game outcome.
     * @returns {void}
     */
    showGameOverImage(result) {
        this.world.gameOver = true;
        this.world.paused = true; 
        this.stop(); 

        this.world.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png';
               if (result === 'win') {
            this.world.playSound('win');
        } else {
            this.world.playSound('lose');
        }

        this.world.gameOverImage.onload = () => {
            this.world.gameOverImageShown = true;
            this.world.draw(); 
        };
        this.world.gameOverImage.onerror = (e) => {
            console.error("Failed to load game over image:", e);
            this.world.gameOverImageShown = true;
            this.world.draw();
        };
    }

    /**
     * Stops all active game loops and clears intervals for a full game halt.
     * @returns {void}
     */
    stop() {
        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }

        
        if (this.world.collisionInterval) {
            clearInterval(this.world.collisionInterval);
            this.world.collisionInterval = null;
        }

        
        if (this.world.character && typeof this.world.character.clearAllIntervals === 'function') {
            this.world.character.clearAllIntervals();
        }

        if (this.world.level && this.world.level.enemies) {
            this.world.level.enemies.forEach(enemy => {
                if (enemy && typeof enemy.clearAllIntervals === 'function') {
                    enemy.clearAllIntervals();
                }
            });
        }

        if (this.world.throwableObjects) {
            this.world.throwableObjects.forEach(bottle => {
                if (bottle && typeof bottle.clearAllIntervals === 'function') {
                    bottle.clearAllIntervals();
                }
            });
        }

        if (this.world.level && this.world.level.clouds) {
            this.world.level.clouds.forEach(cloud => {
                if (cloud && typeof cloud.clearAllIntervals === 'function') {
                    cloud.clearAllIntervals();
                }
            });
        }

    
        if (this.world.character && this.world.character.sounds && this.world.character.sounds.walk && !this.world.character.sounds.walk.paused) {
            this.world.character.sounds.walk.pause();
            this.world.character.sounds.walk.currentTime = 0;
        }
    }

    /**
     * Stops the main requestAnimationFrame loop.
     * @returns {void}
     */
    stopAnimation() {
        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }
    }

    /**
     * Stops the collision check interval.
     * @returns {void}
     */
    stopCollisionInterval() {
        if (this.world.collisionInterval) {
            clearInterval(this.world.collisionInterval);
            this.world.collisionInterval = null;
        }
    }

    /**
     * Stops movements and animations for all dynamic game objects.
     * @returns {void}
     */
    stopMovableObjects() {
        const allMovableObjects = [
            this.world.character,  ...this.world.level.enemies,
            ...this.world.level.clouds,...this.world.throwableObjects
        ];
        allMovableObjects.forEach(obj => {
            if (obj) {
                this.stopObjectIntervals(obj); 
                if (obj.speed !== undefined) {
                    obj.originalSpeed = obj.speed === 0 ? obj.originalSpeed : obj.speed; 
                    obj.speed = 0; 
                }
            }
        });
    }

    /**
     * Helper method to clear intervals for a specific movable object.
     * @param {MoveableObject} obj The object whose intervals to clear.
     * @returns {void}
     */
    stopObjectIntervals(obj) {
        if (obj.animationInterval) {
            clearInterval(obj.animationInterval);
            obj.animationInterval = null;
        }
        if (obj.moveInterval) {
            clearInterval(obj.moveInterval);
            obj.moveInterval = null;
        }
        if (obj.gravityInterval) {
            clearInterval(obj.gravityInterval);
            obj.gravityInterval = null;
        }
        
        if (obj.jumpInterval) {
            clearInterval(obj.jumpInterval);
            obj.jumpInterval = null;
        }
    }

    /**
     * Clears arrays of dynamic game objects (e.g., after game over for a fresh start).
     * @returns {void}
     */
    clearGameObjects() {
        this.world.throwableObjects = [];
        this.world.droppedCoins = []; 
       
    }
}