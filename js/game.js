/**
 * The canvas element.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The world object.
 * @type {World}
 */
let world;

/**
 * The keyboard object.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * The current start sound.
 * @type {Audio|null}
 */
let currentStartSound = null;

/**
 * The timeout ID for the start sound.
 * @type {number|null}
 */
let startSoundTimeoutId = null;

/**
 * Flag to track whether sound is enabled.
 * @type {boolean}
 */
let soundEnabled = localStorage.getItem('soundEnabled') === 'false' ? false : true;

/**
 * Initializes the game.
 * @param {function} callback The callback function.
 */
function init(callback) {
  canvas = document.getElementById('canvas');
  initLevel(); 
  world = new World(canvas, keyboard);
  world.soundEnabled = soundEnabled;
  
  if (callback) callback();
}

/**
 * Replays the game.
 */
function replayGame() {
  if (world && typeof world.stop === 'function') {
    world.stop(); 
  }
  keyboard = new Keyboard();   
  initLevel();                 
  world = new World(canvas, keyboard);
  world.soundEnabled = soundEnabled;  
  world.gameOver = false;
  world.gameOverImageShown = false;
  handleStartSound();  
  
}

/**
 * Handles the start sound.
 */
function handleStartSound() {
    clearPreviousTimeout();
    if (soundEnabled) {
        stopCurrentSound();
        playNewStartSound();
    } else {
        stopCurrentSound();
    }
}

/**
 * Clears the previous timeout.
 */
function clearPreviousTimeout() {
    if (startSoundTimeoutId) {
        clearTimeout(startSoundTimeoutId);
        startSoundTimeoutId = null;
    }
}

/**
 * Stops the current sound.
 */
function stopCurrentSound() {
    if (currentStartSound && !currentStartSound.paused) {
        currentStartSound.pause();
        currentStartSound.currentTime = 0;
        currentStartSound = null;
    }
}

/**
 * Plays a new start sound.
 */
function playNewStartSound() {
    const startSound = new Audio('audio/S31-Winning the Race.ogg');
    startSound.volume = 0.5; currentStartSound = startSound;
    startSound.play().catch(err => {
        if (err.name !== 'AbortError') {
            console.error('Failed to play start sound:', err);
        }
    });
    startSoundTimeoutId = setTimeout(() => {
        if (currentStartSound === startSound) {
            startSound.pause(); startSound.currentTime = 0;
            currentStartSound = null;startSoundTimeoutId = null;
        }
    }, 3000);
}

/**
 * Hides the start screen.
 */
function hideStartScreen() {
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        startScreen.style.display = 'none';
    }
    const canvas = document.getElementById('canvas'); 
    if (canvas) canvas.style.display = 'block';
}

/**
 * Handles the in-game menu display.
 */
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

/**
 * Preloads images.
 * @param {string[]} imageUrls The URLs of the images to preload.
 * @returns {Promise} A promise that resolves when all images are loaded.
 */
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
/**
 * Updates the in-game menu and help visibility based on window size.
 */
function updateInGameMenuVisibility() {
    const inGameMenu = document.getElementById('inGameMenu');
    if (window.innerWidth <= 1029) {
        inGameMenu?.classList.add('hide-on-mobile');
    } else {
        inGameMenu?.classList.remove('hide-on-mobile');
    }

    const inGameHelp = document.getElementById('inGameHelp');
    if (window.innerWidth <= 920) {
        inGameHelp.style.display = 'none';
    } else {
        inGameHelp.style.display = 'block';
    }
}
function handleWindowResize() {
    window.addEventListener('resize', updateInGameMenuVisibility);
}





/**
 * Hides the header.
 */
function hideHeader() {
    const h1 = document.querySelector('h1');
    if (h1) h1.style.display = 'none'; 
}

/**
 * Shows the in-game menu.
 */
function showInGameMenu() {
    const inGameMenu = document.getElementById('inGameMenu');
    if (inGameMenu) inGameMenu.classList.remove('hidden');    
}

/**
 * Shows the play/pause controls.
 */
function showPlayPauseControls() {
    const playPauseControls = document.getElementById('play-pause-controls');
    if (playPauseControls) playPauseControls.style.display = 'block';        
}

/**
 * Gets the click coordinates on the canvas.
 * @param {HTMLCanvasElement} canvas The canvas element.
 * @param {MouseEvent} event The mouse event.
 * @returns {{x: number, y: number}} The click coordinates.
 */
function getCanvasClickCoordinates(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

/**
 * Handles a click event on the canvas.
 * @param {World} world The world object.
 * @param {number} x The x-coordinate of the click.
 * @param {number} y The y-coordinate of the click.
 */
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

/**
 * Adds a click listener to the canvas.
 * @param {HTMLCanvasElement} canvas The canvas element.
 */
function addCanvasClickListener(canvas) {
    if (!canvas._clickHandlerAdded) {
        canvas.addEventListener('click', function (event) {
            const { x, y } = getCanvasClickCoordinates(canvas, event);
            handleCanvasClick(world, x, y);
        });
        canvas._clickHandlerAdded = true; 
    }
}

/**
 * Starts the game.
 */
function startGame() {
     const inGameMenu = document.getElementById('inGameMenu');
  if (inGameMenu) inGameMenu.classList.add('game-running');
    prepareUIForGameStart();
  const canvas = document.getElementById('canvas');
  if (canvas) canvas.style.display = 'none';

  init(() => {
    addCanvasClickListener(canvas);
    waitForGameInitialization(canvas);
  });
}

/**
 * Prepares the UI for game start.
 */
function prepareUIForGameStart() {
  hideStartScreen();
  handleInGameMenuDisplay();
  handleWindowResize();
   updateInGameMenuVisibility();
  hideHeader();
  showInGameMenu();
  showPlayPauseControls();
}

/**
 * Waits for the game initialization.
 * @param {HTMLCanvasElement} canvas The canvas element.
 */
function waitForGameInitialization(canvas) {
  const intervalId = setInterval(() => {
    if (world.gameInitialized) {
      hideLoadingScreen();
      if (canvas) canvas.style.display = 'block';
      handleStartSound();
      clearInterval(intervalId);
    }
  }, 100);
}

/**
 * Hides the loading screen.
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const inGameMenu = document.getElementById('inGameMenu');
  if (inGameMenu) inGameMenu.classList.remove('game-running');
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

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startGame();
    });
});

// Keyboard event listeners
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowDown") keyboard.DOWN = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key.toLowerCase() === 'd') keyboard.D = true;
});

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