class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar('health');
    coinBar = new StatusBar('coin');
    bottleBar = new StatusBar('bottle');
    throwableObjects = []; // <-- IMPORTANT!! Initialize this array

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.checkCollision();
        this.checkThrowBottle(); // <-- Move here (NOT inside draw())
        this.bottleBar.setPercentage(this.character.bottleCount * 20); // <-- ADD THIS LINE

        this.draw();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollision() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (!enemy.isDead && this.character.isColliding(enemy)) {
                    // Only collide if enemy is alive
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            });
            
    
            this.level.collectibles.forEach((collectible, index) => {
                if (this.character.isColliding(collectible)) {
                    if (collectible.type === 'bottle') {
                        if (this.character.bottleCount < 5) {
                            this.character.bottleCount++;
                            this.bottleBar.setPercentage(this.character.bottleCount * 20);
                            this.level.collectibles.splice(index, 1);
                        }
                    } 
                    else if (collectible.type === 'life') {
                        if (this.character.energy < 100) { // Only heal if not full health
                            this.character.energy += 20;   // Heal 20% (adjust as you like)
                            if (this.character.energy > 100) {
                                this.character.energy = 100; // Max cap at 100%
                            }
                            this.statusBar.setPercentage(this.character.energy);
                            this.level.collectibles.splice(index, 1);
                        }
                    }
                    else {
                        // For coins and other collectibles
                        this.level.collectibles.splice(index, 1);
                    }
                }
            });

            this.throwableObjects.forEach((bottle, bottleIndex) => {
                this.level.enemies.forEach((enemy) => {
                    if (bottle.isColliding(enemy) && !enemy.isDead) {
                        enemy.hit(); // Kill the enemy
                        this.throwableObjects.splice(bottleIndex, 1); // Remove the bottle
                    }
                });
            });
            
        }, 1000/66);
    }
    
    checkThrowBottle() {
        setInterval(() => { // CHECK every 100ms
            if (this.keyboard.D && this.character.bottleCount > 0) {
                this.throwBottle();
            }
        }, 100); 
    }

    throwBottle() {
        let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.character.bottleCount--;
        this.bottleBar.setPercentage(this.character.bottleCount * 20);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundobjects);  
        this.addObjectsToMap(this.level.collectibles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);

        // 💥 Move and draw throwable bottles
        this.throwableObjects.forEach((bottle) => bottle.move());
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.bottleBar);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);

        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}




    /*addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -mo.x - mo.width, // flip horizontally
                mo.y,
                mo.width,
                mo.height
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }*/
    
