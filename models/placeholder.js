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
    throwableObjects = []; 
    sounds = {
        'throw': new Audio('audio/SHOOT011.mp3'),
        'collect-bottle': new Audio('audio/collect-bottle.wav'),
        'collect-life': new Audio('audio/collect-life.ogg')
    };
    gameOverImage = new Image();
    gameOverImageShown = false;
    gameOver = false;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.checkCollision();
        this.checkThrowBottle(); 
        this.bottleBar.setPercentage(this.character.bottleCount * 20); 

        this.draw();
    }
    
    
    

    setWorld() {
        this.character.world = this;
    }

    checkCollision() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (!enemy.isDead && this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                    if (this.character.energy <= 0) {
                        this.showGameOverImage('lose');
                    }
                }
            });
            
    
            this.level.collectibles.forEach((collectible, index) => {
                if (this.character.isColliding(collectible)) {
                    if (collectible.type === 'bottle') {
                        if (this.character.bottleCount < 5) {
                            this.character.bottleCount++;
                            this.bottleBar.setPercentage(this.character.bottleCount * 20);
                            this.level.collectibles.splice(index, 1);
                            this.playSound('collect-bottle');
                        }
                    } 
                    else if (collectible.type === 'life') {
                        if (this.character.energy < 100) { 
                            this.character.energy += 20;   
                            if (this.character.energy > 100) {
                                this.character.energy = 100; 
                            }
                            this.statusBar.setPercentage(this.character.energy);
                            this.level.collectibles.splice(index, 1);
                            this.playSound('collect-life');
                        }
                    }
                    else {
                        this.level.collectibles.splice(index, 1);
                    }
                }
            });

            this.throwableObjects.forEach((bottle, bottleIndex) => {
                this.level.enemies.forEach((enemy) => {
                    if (bottle.owner !== enemy && bottle.isColliding(enemy) && !enemy.isDead) {
                        enemy.hit(); 
                        this.throwableObjects.splice(bottleIndex, 1);
                        if (enemy instanceof Endboss && enemy.isDead) {
                            this.showGameOverImage('win');
                        }
                    }
                });
            });
                        
        }, 1000/66);
    }
    
    checkThrowBottle() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' && this.character.bottleCount > 0 && !this.gameOver) {
                this.throwBottle();
                this.playSound('throw');
            }
        });
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
        this.addToMap(this.character); 
        this.addObjectsToMap(this.level.collectibles);      
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
    
        this.throwableObjects.forEach((bottle) => bottle.move());
        this.addObjectsToMap(this.throwableObjects);
    
        this.ctx.translate(-this.camera_x, 0);
    
        this.addToMap(this.bottleBar);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
    
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
    
        if (this.gameOverImageShown) {
            console.log('Drawing game over image');
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 400, 200);
            this.ctx.restore();
        } else {
            console.log('Game over image not shown');
        }
    
        if (!this.gameOver) {
            let self = this;
            requestAnimationFrame(function() {
                self.draw();
            });
        }
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

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.volume = 0.5;
            sound.play().catch(err => console.error('Sound error:', err));
        }
    }

    showGameOverImage(result) {
        console.log('Showing game over image');
        this.gameOver = true;
        this.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You Lost B.png';
        this.gameOverImage.onload = () => {
            console.log('Game over image loaded');
            this.gameOverImageShown = true;
        };
        this.gameOverImage.onerror = () => {
            console.log('Error loading game over image');
        };
    }
}