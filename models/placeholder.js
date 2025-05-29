class World {
  soundEnabled = true;

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
  started = false;

  sounds = {
    'throw': new Audio('audio/SHOOT011.mp3'),
    'collect-bottle': new Audio('audio/collect-bottle.wav'),
    'collect-life': new Audio('audio/collect-life.ogg'),
    'explode': new Audio('audio/8bit_bomb_explosion.wav'),
    'win': new Audio('audio/Won!.wav'),
    'bottle-hit': new Audio('audio/1.mp3'),
    'lose': new Audio('audio/vgdeathsound.ogg'),
  };

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.checkCollision();
    this.checkThrowBottle();

    this.restartButton = new RestartButton(650, 10, 100, 30, this.ctx, 'Replay');
    this.quitButton = new QuitButton(770, 10, 40, 40, this.ctx, 'Quit');
    this.touchControls = new TouchControls(this.ctx, this.canvas);
    this.touchControls.handleTouchEvents(canvas, keyboard);

    this.pausedIcon.src = 'img/assets/pause_circle.svg';
    this.playIcon.src = 'img/assets/smart_play__WHITE.svg';

    let self = this;
    let imagesLoaded = 0;

    function imageLoaded() {
      imagesLoaded++;

      if (imagesLoaded === 2) {
        self.playPauseButton = new Button(680, 10, 40, 40, self.ctx, self.pausedIcon, self.playIcon);
        self.playPauseButton.icon = self.pausedIcon;

window.onload = function() {
  document.addEventListener('click', (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (world.gameOver) {
      world.restartButton.handleClick(x, y);
    } else {
      world.playPauseButton.handleClick(x, y, world);
      world.quitButton.handleClick(x, y, world); // Add this line
    }
  });
};
        self.draw();
      }
    }

    this.pausedIcon.onload = imageLoaded;
    this.playIcon.onload = imageLoaded;
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollision() {
    setInterval(() => {
      if (this.gameOver || this.paused) return;
      if (!this.paused) 
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

      this.level.collectibles.forEach((collectible, index) => {
        if (this.character.isColliding(collectible)) {
          if (collectible.type === 'coin') {
            if (this.coinBar.percentage >= 100) {
              this.playSound('coin-lost');
            } else {
              this.coinBar.percentage += 20;
              if (this.coinBar.percentage > 100) {
                this.coinBar.percentage = 100;
              }
              this.coinBar.setPercentage(this.coinBar.percentage);
            }
            this.level.collectibles.splice(index, 1);
          } else if (collectible.type === 'bottle') {
            if (this.character.bottleCount < 5) {
              this.character.bottleCount++;
              this.bottleBar.setPercentage(this.character.bottleCount * 20);
              this.level.collectibles.splice(index, 1);
              this.playSound('collect-bottle');
            }
          } else if (collectible.type === 'life') {
            if (this.character.energy < 100) { 
              this.character.energy += 20;   
              if (this.character.energy > 100) {
                this.character.energy = 100; 
              }
              this.statusBar.setPercentage(this.character.energy);
              this.level.collectibles.splice(index, 1);
              this.playSound('collect-life');
            }
          } else {
            this.level.collectibles.splice(index, 1);
          }
        }
      });

      for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bottle = this.throwableObjects[i];
        this.level.enemies.forEach((enemy) => {
          if (bottle.owner !== enemy && bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
            bottle.splash(); 
            bottle.hasHit = true; 
            enemy.hit(); 
            this.playSound('explode');
          }
        });

        if (bottle.owner instanceof Endboss && bottle.isColliding(this.character) && !bottle.hasHit) {
          bottle.splash(); 
          bottle.splash(); 
          bottle.hasHit = true; 
          this.character.hit();
          this.playSound('bottle-hit');
          this.statusBar.setPercentage(this.character.energy);
          if (this.character.energy <= 0) {
            this.showGameOverImage('lose');
          }
        }

        if (bottle.finishedSplash) {
          this.throwableObjects.splice(i, 1);
        }
      }
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
    this.throwableObjects.push(bottle);
    this.character.bottleCount--;
    this.bottleBar.setPercentage(this.character.bottleCount * 20);
  }

  draw() {
    if (this.paused) return;
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
    this.touchControls.draw();

    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);
    if (!this.gameOver) {
      this.playPauseButton.draw();
    } else {
      this.restartButton.draw();
    }
    if (this.quitButton) this.quitButton.draw();

    if (this.gameOverImageShown && this.gameOverImage.complete) {
      console.log('Drawing game over image', this.gameOverImage.src);
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.drawImage(this.gameOverImage, this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 400, 200);
      this.ctx.restore();
      console.log('Game over image drawn');
    } else if (this.gameOverImageShown && !this.gameOverImage.complete) {
      console.log('Game over image not loaded yet', this.gameOverImage.src);
    }    
    if (!this.gameOver) {
      let self = this;
      requestAnimationFrame(function() {
        self.draw();
      });
    }
    this.droppedCoins.forEach((coin) => {
      coin.update();
      this.addToMap(coin);
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

  pause() {
    this.paused = true;
    this.level.enemies.forEach((enemy) => {
      enemy.speed = 0;
    });
  }

  resume() {
    this.paused = false;
    this.level.enemies.forEach((enemy) => {
      enemy.speed = enemy.originalSpeed; 
    });
    this.draw();
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
    console.log('Showing game over image');
    this.gameOver = true;
    this.level.enemies.forEach((enemy) => {
      enemy.speed = 0; 
    });

    this.gameOverImage.src = result === 'win' ? 'img/img/You won, you lost/You Won B.png' : 'img/img/You won, you lost/You Lost B.png';
    if (result === 'win') {
      this.playSound('win');
    } else {
      this.playSound('lose');
    }
    this.gameOverImage.onload = () => {
      console.log('Game over image loaded');
      this.gameOverImageShown = true;
      this.draw(); 
    };
    this.gameOverImage.onerror = () => {
      console.log('Error loading game over image');
    };
  }

    quitGame() {
            console.log('Quitting game');

    // Add code here to quit the game
    // For example, you could close the window or redirect to a different page
    window.close(); // This might not work in all browsers
    // Or
    window.location.href = 'index.html'; // Redirect to a different page
  }

}