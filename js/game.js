let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

function init(callback) {
  canvas = document.getElementById('canvas');
  initLevel(); 
  world = new World(canvas, keyboard);
  console.log('my character is', world.character);
  if (callback) callback();
}

function replayGame() {
  if (world && typeof world.stop === 'function') {
    world.stop(); 
  }
  keyboard = new Keyboard();   
  initLevel();                 
  world = new World(canvas, keyboard); 
  world.gameOver = false;
  world.gameOverImageShown = false;
  handleStartSound();  
  
}

function handleStartSound() {
    if (soundEnabled) {
        const startSound = new Audio('audio/S31-Winning the Race.ogg');
        startSound.volume = 0.5;
        startSound.play().catch(err => console.error('Failed to play start sound:', err));        
        setTimeout(() => {
            startSound.pause();
            startSound.currentTime = 0;
        }, 3000);     
    }
}

function hideStartScreen() {
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        startScreen.style.display = 'none';
    }
    const canvas = document.getElementById('canvas'); 
    if (canvas) canvas.style.display = 'block';
}

function handleInGameMenuDisplay() {
    if (window.innerWidth <= 920) {
        const inGameMenu = document.getElementById('inGameMenu');
        if (inGameMenu) {
            inGameMenu.style.display = 'none';
        }
        const inGameHelp = document.getElementById('inGameHelp');
        if (inGameHelp) {
            inGameHelp.style.display = 'none';
        }
    } else {
        const inGameHelp = document.getElementById('inGameHelp');
        if (inGameHelp) {
            inGameHelp.style.display = 'block';
        }
    }
}
function preloadImages(imageUrls) {
  return new Promise((resolve, reject) => {
    let loaded = 0;
    let images = [];

    imageUrls.forEach((url, index) => {
      images[index] = new Image();
      images[index].onload = () => {
        loaded++;
        if (loaded === imageUrls.length) resolve(images);
      };
      images[index].onerror = reject;
      images[index].src = url;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'block';
    preloadImages(World.imagesToLoad).then(() => {
      if (loadingScreen) loadingScreen.style.display = 'none';
      startGame();
    }).catch(error => {
      console.error('Error preloading images:', error);
      if (loadingScreen) loadingScreen.style.display = 'none';
      startGame(); 
    });
  });
});

function handleWindowResize() {
    window.addEventListener('resize', () => {
        const inGameMenu = document.getElementById('inGameMenu');
        if (window.innerWidth <= 1029) {
            inGameMenu.classList.add('hide-on-mobile');
        } else {
            inGameMenu.classList.remove('hide-on-mobile');
        }
        const inGameHelp = document.getElementById('inGameHelp');
        if (window.innerWidth <= 920) {
            inGameHelp.style.display = 'none';
        } else {
            inGameHelp.style.display = 'block';
        }
    });
}

function hideHeader() {
    const h1 = document.querySelector('h1');
    if (h1) h1.style.display = 'none'; 
}

function showInGameMenu() {
    const inGameMenu = document.getElementById('inGameMenu');
    if (inGameMenu) inGameMenu.classList.remove('hidden');    
}

function showPlayPauseControls() {
    const playPauseControls = document.getElementById('play-pause-controls');
    if (playPauseControls) playPauseControls.style.display = 'block';        
}

function getCanvasClickCoordinates(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

function handleCanvasClick(world, x, y) {
    if (world) {
        if (world.playPauseButton) {
            world.playPauseButton.handleClick(x, y, world);
        }
        if (world.quitButton) {
            world.quitButton.handleClick(x, y, world);
        }
        if (world.restartButton && world.gameOver) {
            world.restartButton.handleClick(x, y, world);
        }
    }
}

function addCanvasClickListener(canvas) {
    if (!canvas._clickHandlerAdded) {
        canvas.addEventListener('click', function (event) {
            const { x, y } = getCanvasClickCoordinates(canvas, event);
            handleCanvasClick(world, x, y);
        });
        canvas._clickHandlerAdded = true; 
    }
}

function startGame() {
  console.log('Starting game, sound enabled:', soundEnabled);
  handleStartSound();
  hideStartScreen();
  handleInGameMenuDisplay();
  handleWindowResize();
  hideHeader();
  showInGameMenu();
  showPlayPauseControls();
  const canvas = document.getElementById('canvas');
  if (canvas) canvas.style.display = 'none'; 
  init(() => {
    addCanvasClickListener(canvas);
    const intervalId = setInterval(() => {
      if (world.gameInitialized) {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (canvas) canvas.style.display = 'block'; 
        clearInterval(intervalId);
      }
    }, 100);
  });
}


document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startGame();
    });
});
// Keydown event listener
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowDown") keyboard.DOWN = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key.toLowerCase() === 'd') keyboard.D = true;
});

// Keyup event listener
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === "ArrowDown") keyboard.DOWN = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key.toLowerCase() === 'd') keyboard.D = false;
});


window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');    
    let isInfoOverlayVisible = false;
    if (infoButton) {infoButton.addEventListener('click', () => {isInfoOverlayVisible = !isInfoOverlayVisible;
            infoOverlay.style.display = isInfoOverlayVisible ? 'block' : 'none';
        });
    }
    document.addEventListener('click', (event) => {
        if (isInfoOverlayVisible && !infoOverlay.contains(event.target) && event.target !== infoButton) {
            infoOverlay.style.display = 'none';
            isInfoOverlayVisible = false;
        }
    });
});


function toggleFullscreen(gameContainer) {
    if (!isFullscreen(gameContainer)) {
        enterFullscreen(gameContainer);
    } else {
        exitFullscreen();
    }
}

function isFullscreen(gameContainer) {
    return !!(
        document.fullscreenElement === gameContainer ||
        document.webkitFullscreenElement === gameContainer ||
        document.mozFullScreenElement === gameContainer ||
        document.msFullscreenElement === gameContainer
    );
}

function enterFullscreen(gameContainer) {
    try {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) {
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
    } catch (error) {
        console.error('Fullscreen failed:', error);
    }
}

function exitFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } catch (error) {
        console.error('Exit fullscreen failed:', error);
    }
}

function updateFullscreenIcon(fullscreenIcon, isFullscreenIcon) {
    const iconPath = isFullscreenIcon 
        ? 'img/assets/fullscreen_exit.svg'
        : 'img/assets/fullscreen_icon.svg';
        
    fetch(iconPath)
        .then(response => {
            if (response.ok) {
                fullscreenIcon.src = iconPath;
            } else {
                console.error('Icon not found:', iconPath);
            }
        })
        .catch(error => console.error('Icon fetch error:', error));
}

function handleFullscreenButton(fullscreenButton, gameContainer, fullscreenIcon) {
    fullscreenButton.addEventListener('click', () => {
        toggleFullscreen(gameContainer);
    });
    [   'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ].forEach(event => {
        document.addEventListener(event, () => {
            updateFullscreenIcon(fullscreenIcon, isFullscreen(gameContainer));
        });
    });
    updateFullscreenIcon(fullscreenIcon, isFullscreen(gameContainer));
}

function handleSoundButton(soundButtonInGame, soundIconInGame) {
    soundButtonInGame.addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        if (world) {
            world.soundEnabled = soundEnabled;
        }
        console.log('Sound enabled:', soundEnabled);
        soundIconInGame.src = soundEnabled 
            ? 'img/assets/Mic-On.svg' 
            : 'img/assets/Mic-Off.svg';
        e.stopPropagation();
    });
}

function setupGameControls() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const soundButtonInGame = document.getElementById('soundButtonInGame');
    const soundIconInGame = document.getElementById('soundIconInGame');
    const gameContainer = document.querySelector('.game-container'); 
    if (fullscreenButton && fullscreenIcon && soundButtonInGame && soundIconInGame && gameContainer) {
        handleFullscreenButton(fullscreenButton, gameContainer, fullscreenIcon);
        handleSoundButton(soundButtonInGame, soundIconInGame);
    }
}

document.addEventListener('DOMContentLoaded', setupGameControls);
function isSmallScreen() {
  return window.innerWidth <= 920;
}
window.addEventListener('resize', () => {
    // Just redraw the world on resize — your game loop should already handle this
    world.draw();
});


                                            