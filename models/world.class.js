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
    endbossHealthBar = new StatusBar('endbossHealth'); 
    collisionManager;
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
    gameLifecycleManager;   

    initProperties(canvas, keyboard) {
      this.ctx = canvas.getContext('2d');
      this.canvas = canvas;
       this.keyboard = keyboard;
       this.soundEnabled = soundEnabled;
    }

    initGameLogic() {
        this.setWorld();       
        this.collisionManager.startCollisionChecks();
        this.collisionManager.checkThrowBottle();
        this.gameLifecycleManager.startCollisionDetection();         
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
               self.playPauseButton.icon = self.pausedIcon; self.draw();
            }
        }  this.pausedIcon.onload = imageLoaded; this.playIcon.onload = imageLoaded;
    }

    constructor(canvas, keyboard) {
       this.initProperties(canvas, keyboard);
        this.initManagers(); 
      this.initGameLogic();        
       this.initUIComponents();
       this.loadPlayPauseIcons();   
       this.character.bottleCount = 0;
        this.bottleBar = new StatusBar('bottle');
        this.bottleBar.setPercentage(this.character.bottleCount * 20);         
    }

    initManagers() {        
        this.collisionManager = new CollisionManager(this);
       this.gameLifecycleManager = new GameLifecycleManager(this); 

    }

    setWorld() {
        this.character.world = this;         
        this.level.enemies.forEach(enemy => {
            enemy.world = this;             
        });        
        if (this.level.endboss) { 
            this.level.endboss.world = this;
            
        }
    }

    loadImage(src) {
      World.imagesToLoad.push(src);    
    }
    
    throwBottle() {
        
       if (this.character.bottleCount > 0) {
           let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50, this.character.otherDirection);
           bottle.owner = this.character;
           this.throwableObjects.push(bottle); 
           this.character.bottleCount--;
           this.bottleBar.setPercentage(this.character.bottleCount * 20);
        }
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
        this.addToMap(this.endbossHealthBar);
        
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
           this.animationFrameId = null; return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);this.drawBackground(); this.checkEndbossActivation(); this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();this.drawButtons(); this.drawGameOverImage();
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

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

     playSound(name) {
        if (this.soundEnabled) {                
            const sound = allGameSounds[name]; 
            if (sound) {
                sound.currentTime = 0; 
                sound.volume = 0.5;    
                sound.play().catch(err => console.error('Sound playback error:', err));
            }             
        }
    }
    
    /**
     * Displays the game over image and stops all game activity.
     * This method now delegates to the GameLifecycleManager.
     * @param {string} result 'win' or 'lose'
     */
    showGameOverImage(result) {        
        this.gameLifecycleManager.showGameOverImage(result);
    }  

    quitGame() {
        window.location.href = 'index.html';
    }
}