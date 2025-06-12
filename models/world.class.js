class World {
    soundEnabled = true;
    static imagesToLoad = [];
      gameInitialized = false;


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
    droppedCoins = [];
    playPauseButton;
    pausedIcon = new Image();
    playIcon = new Image();

    gameOverImage = new Image();
    gameOverImageShown = false;
    gameOver = false;
    paused = false;
    animationFrameId = null;
    collisionInterval = null;

    sounds = {
        'throw': new Audio('audio/SHOOT011.mp3'),
        'collect-bottle': new Audio('audio/collect-bottle.wav'),
        'collect-life': new Audio('audio/collect-life.ogg'),
        'explode': new Audio('audio/8bit_bomb_explosion.wav'),
        'win': new Audio('audio/Won!.wav'),
        'bottle-hit': new Audio('audio/1.mp3'),
        'lose': new Audio('audio/vgdeathsound.ogg'),
        'coin': new Audio('audio/collect-coin.mp3'),
    };

    initProperties(canvas, keyboard) {
      this.ctx = canvas.getContext('2d');
      this.canvas = canvas;
       this.keyboard = keyboard;
       this.soundEnabled = soundEnabled;
    }

    initGameLogic() {
        this.setWorld();
        this.checkCollision();
        this.checkThrowBottle();
    }

   initUIComponents() {
       this.restartButton = new RestartButton(650, 10, 100, 30, this.ctx, 'Replay');
       this.quitButton = new QuitButton(770, 10, 40, 40, this.ctx, 'Quit');
       this.touchControls = new TouchControls(this.ctx, this.canvas);
       this.touchControls.handleTouchEvents(this.canvas, this.keyboard);
    }

    loadPlayPauseIcons() {
       this.pausedIcon.src = 'img/assets/pause_circle.svg';
       World.imagesToLoad.push('img/assets/pause_circle.svg');
       this.playIcon.src = 'img/assets/smart_play__WHITE.svg';
        World.imagesToLoad.push('img/assets/smart_play__WHITE.svg');

        let self = this;
        let imagesLoaded = 0;
       function imageLoaded() {
           imagesLoaded++;
            if (imagesLoaded === 2) {
              self.playPauseButton = new Button(680, 10, 40, 40, self.ctx, self.pausedIcon, self.playIcon);
               self.playPauseButton.icon = self.pausedIcon;
               self.draw();
            }
        }
        this.pausedIcon.onload = imageLoaded;
        this.playIcon.onload = imageLoaded;
    }

    constructor(canvas, keyboard) {
       this.initProperties(canvas, keyboard);
       this.initGameLogic();
       this.initUIComponents();
       this.loadPlayPauseIcons();
    }

    setWorld() {
        this.character.world = this;
    }
      loadImage(src) {
    World.imagesToLoad.push(src);
    // Load the image here
  }


    checkEnemyCollision() {
        this.level.enemies.forEach((enemy) => {
           if (!enemy.isDead && this.character.isColliding(enemy)) {
            
                if (this.character.y < enemy.y && this.character.speedY >= 0) {
                      enemy.die();
                      this.character.speedY = -10;
                } else {
                  this.character.hit();
                  this.statusBar.setPercentage(this.character.energy);
                   if (this.character.energy <= 0) {
                      this.showGameOverImage('lose');
                    }
                }
            }
        });
    }

    checkCollectibleCollision() {
          this.level.collectibles.forEach((collectible, index) => {
                if (this.character.isColliding(collectible)) {
                  if (collectible.type === 'coin') {
                    this.collectCoin(collectible, index);
                    } else if (collectible.type === 'bottle') {
                      this.collectBottle(collectible, index);
                    } else if (collectible.type === 'life') {
                      this.collectLife(collectible, index);
                    } else {
                      this.level.collectibles.splice(index, 1);
                    }
                }
            });
    }

    collectCoin(collectible, index) {
        if (this.coinBar.percentage < 100) {
            this.coinBar.percentage += 20;
        if (this.coinBar.percentage > 100) {
            this.coinBar.percentage = 100;
        }
           this.coinBar.setPercentage(this.coinBar.percentage);
           this.playSound('coin');
           this.level.collectibles.splice(index, 1);
        } else {
          this.playSound('coin-lost');
        }
    }

   collectBottle(collectible, index) {
       if (this.character.bottleCount < 5) {
           this.character.bottleCount++;
           this.bottleBar.setPercentage(this.character.bottleCount * 20);
           this.level.collectibles.splice(index, 1);
           this.playSound('collect-bottle');
        }
    }

   collectLife(collectible, index) {
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

 checkBottleEnemyCollision(bottle) {
       
        if (!bottle || typeof bottle !== 'object' || !('owner' in bottle)) return;

        this.level.enemies.forEach((enemy) => {
            const isBottleFromCharacter = bottle.owner instanceof Character;

            if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
               
                if (isBottleFromCharacter && !(enemy instanceof Character)) {
                    bottle.splash();
                    bottle.hasHit = true;
                    enemy.hit();
                    this.playSound('explode');
                }
               
            }
        });
        
    }


    checkBottleCharacterCollision(bottle) {
        if (!bottle || typeof bottle !== 'object') return;
        if (bottle.owner instanceof Endboss && bottle.isColliding(this.character) && !bottle.hasHit) {
            bottle.splash();
            bottle.hasHit = true;
            this.character.hit();
            this.playSound('bottle-hit');
            this.statusBar.setPercentage(this.character.energy);
            if (this.character.energy <= 0) {
               this.showGameOverImage('lose');
            }
        }
    }

    removeFinishedBottles() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
           if (bottle.finishedSplash) {
               this.throwableObjects.splice(i, 1);
            }
        }
    }

    checkThrowableCollision() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
            this.checkBottleEnemyCollision(bottle);
            this.checkBottleCharacterCollision(bottle);
        }
          this.removeFinishedBottles();
    }

    checkCollision() {
        this.collisionInterval = setInterval(() => {
            if (this.gameOver || this.paused) return;

            this.checkEnemyCollision();
            this.checkCollectibleCollision();
            this.checkThrowableCollision();
        }, 1000 / 66);
    }

    checkThrowBottle() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' && this.character.bottleCount > 0 && !this.gameOver && !this.paused) {
                this.throwBottle();
                this.playSound('throw');
            }
        });
        document.addEventListener('throwBottle', () => {
            if (this.character.bottleCount > 0 && !this.gameOver && !this.paused) {
                this.throwBottle();
                
                this.playSound('throw');
            }
        });
    }
    throwBottle() {
    let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50, this.character.otherDirection);
    bottle.owner = this.character;
    this.throwableObjects.push(bottle); 
    this.character.bottleCount--;
    this.bottleBar.setPercentage(this.character.bottleCount * 20);
}

checkEndboss() {
    if (this.endboss && !this.endboss.isDead) {
        const bossInView = this.endboss.x < this.camera_x + this.canvas.width;

        if (bossInView && !this.endboss.isActivated) {
            this.endboss.isActivated = true;
            this.endboss.throwBottles();
        }

        this.endboss.flipImage(this.character.otherDirection);
    }
}

    drawBackground() {
       this.addObjectsToMap(this.level.backgroundobjects);
    }

   drawMainGameObjects() {
         this.addToMap(this.character);
         this.addObjectsToMap(this.level.collectibles);
         this.addObjectsToMap(this.level.enemies);
         this.addObjectsToMap(this.level.clouds);
    }

   drawThrowableObjects() {
       this.throwableObjects.forEach((bottle) => {
           bottle.move();
        });
        this.addObjectsToMap(this.throwableObjects);
    }

    drawDroppedCoins() {
       this.droppedCoins.forEach((coin) => {
          coin.update();
          this.addToMap(coin);
        });
    }

    drawGameObjects() {
       this.drawMainGameObjects();
         if (!this.gameOver) {
           this.drawThrowableObjects();
           this.drawDroppedCoins();
        } else {
           this.addObjectsToMap(this.throwableObjects);
           this.addObjectsToMap(this.droppedCoins);
        }
    }

    drawUI() {
       this.addToMap(this.bottleBar);
       this.addToMap(this.statusBar);
       this.addToMap(this.coinBar);
       this.touchControls.draw();
    }

   drawButtons() {  
       this.ctx.translate(this.camera_x, 0);
       this.ctx.translate(-this.camera_x, 0);
       if (!this.gameOver) {
          this.playPauseButton.draw();
        } else {
          this.restartButton.draw();
        }
         if (this.quitButton) this.quitButton.draw();
    }
       checkEndbossActivation() {
    this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && !enemy.isActivated && !enemy.isDead) {
            const bossVisibleOnCanvasRight = enemy.x + this.camera_x < this.canvas.width;
            const bossVisibleOnCanvasLeft = enemy.x + enemy.width + this.camera_x > 0;

            if (bossVisibleOnCanvasRight && bossVisibleOnCanvasLeft) {
                enemy.isActivated = true;
                enemy.throwBottles();
            }
        }
    });
}



   /* checkEndbossActivation() {
    this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && !enemy.activated && !enemy.isDead) {
            const endbossVisible = enemy.x + enemy.width > this.camera_x &&
                                   enemy.x < this.camera_x + this.canvas.width;

            if (endbossVisible) {
                enemy.activated = true;
                enemy.throwBottles(); // Start throwing
            }
        }
    });
}*/


   drawGameOverImage() {
       if (this.gameOverImageShown && this.gameOverImage.complete) {
           this.ctx.save();
           this.ctx.setTransform(1, 0, 0, 1, 0, 0);
           this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 300, 150);
           this.ctx.restore();
        }
    }

    draw() {
       if (this.paused && !this.gameOverImageShown) {
           this.animationFrameId = null;
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);this.drawBackground(); this.checkEndbossActivation(); this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();this.drawButtons();
        this.drawGameOverImage();
       let self = this;
       this.animationFrameId = requestAnimationFrame(function() {
          self.draw();
        });
        if (!this.gameInitialized) {
           this.gameInitialized = true;
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
       

    pause() {
        this.paused = true;
        this.stop();
    }
    resumeCharacter() {
     this.character.animate();
       if (this.character.originalSpeed) {
        this.character.speed = this.character.originalSpeed;
      }
    }

  resumeEnemies() {
  this.level.enemies.forEach((enemy) => {
    if (enemy.originalSpeed) {
      enemy.speed = enemy.originalSpeed;
    }
    if (enemy.moveInterval) {
      clearInterval(enemy.moveInterval);
      enemy.moveInterval = null;
    }
    if (enemy.animationInterval) {
      clearInterval(enemy.animationInterval);
      enemy.animationInterval = null;
    }
    if (enemy.bottleThrowInterval) {
      clearInterval(enemy.bottleThrowInterval);
      enemy.bottleThrowInterval = null;
      enemy.throwBottles();
    }
    enemy.animate();
  });
}
    resumeClouds() {
        this.level.clouds.forEach((cloud) => {
          cloud.animate();
        });
    }

    // In World class:
resumeThrowableObjects() {
    this.throwableObjects.forEach((bottle) => {
        if (!bottle.animationInterval) {
            bottle.animate(); 
        }

        if (!bottle.gravityInterval && !bottle.hasHit) {
            bottle.applyGravity();
        }

    });
}

   startAnimation() {
      if (!this.animationFrameId) {
        this.draw();
      }
    }

    startCollisionDetection() {
       if (!this.collisionInterval) {
          this.checkCollision();
        }
    }

    resume = () => {
  this.paused = false;
  this.resumeCharacter();
  this.resumeEnemies();
  this.resumeClouds();
  this.resumeThrowableObjects();
  this.startAnimation();
  this.startCollisionDetection();
}


    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    playSound(name) {
        if (this.soundEnabled) {
            const sound = this.sounds[name];
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.5;
                sound.play().catch(err => console.error('Sound error:', err));
            }
        }
    } 

    showGameOverImage(result) {
            this.gameOver = true;
    this.paused = true;
    this.stop();
     this.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png';
    World.imagesToLoad.push(result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You lost b.png');

        if (result === 'win') {
            this.playSound('win');
        } else {this.playSound('lose');            
        }
        this.gameOverImage.onload = () => {this.gameOverImageShown = true;this.draw();
        };
        this.gameOverImage.onerror = () => {this.gameOverImageShown = true; this.draw();
        };
    }

    stopAnimation() {
        if  (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
    }

    stopCollisionInterval() {
       if   (this.collisionInterval) {
          clearInterval(this.collisionInterval);
          this.collisionInterval = null;
        }
    }

    stopMovableObjects() {        
       const allMovableObjects = [
          this.character,
          ...this.level.enemies,
          ...this.level.clouds,
          ...this.throwableObjects
        ];
        allMovableObjects.forEach(obj => {
          this.stopObjectIntervals(obj);
            if (obj.speed !== undefined) {
              obj.originalSpeed = obj.speed;
               obj.speed = 0;
            }
        });
    }

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
    }

   clearGameObjects() {
      this.throwableObjects = [];
       this.droppedCoins = [];
    }

       stop() {
        
        
        if (this.drawIntervalId) { 
            clearInterval(this.drawIntervalId);
            this.drawIntervalId = null;
        }
        if (this.animationFrameId) { 
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }

        

        
        if (this.character && typeof this.character.clearAllIntervals === 'function') {
            this.character.clearAllIntervals();
        }

        
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy && typeof enemy.clearAllIntervals === 'function') {
                    enemy.clearAllIntervals();
                }
            });
        }

        
        if (this.throwableObjects) {
            this.throwableObjects.forEach(bottle => {
                if (bottle && typeof bottle.clearAllIntervals === 'function') {
                    bottle.clearAllIntervals();
                }
            });
        }
        
        if (this.level && this.level.clouds) {
             this.level.clouds.forEach(cloud => {
                 if (cloud && typeof cloud.clearAllIntervals === 'function') {
                     cloud.clearAllIntervals();
                 }
             });
        }
        
    
    }


    quitGame() {
        window.location.href = 'index.html';
    }
}