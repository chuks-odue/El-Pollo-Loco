let canvas;
let world;
let keyboard = new Keyboard();
let currentStartSound = null;
let startSoundTimeoutId = null; 
let soundEnabled = localStorage.getItem('soundEnabled') === 'false' ? false : true;

function init(callback) {
  canvas = document.getElementById('canvas');
  initLevel(); 
  world = new World(canvas, keyboard);
  world.soundEnabled = soundEnabled;
  
  if (callback) callback();
}

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

function handleStartSound() {
    clearPreviousTimeout();
    if (soundEnabled) {
        stopCurrentSound();
        playNewStartSound();
    } else {
        stopCurrentSound();
    }
}

function clearPreviousTimeout() {
    if (startSoundTimeoutId) {
        clearTimeout(startSoundTimeoutId);
        startSoundTimeoutId = null;
    }
}

function stopCurrentSound() {
    if (currentStartSound && !currentStartSound.paused) {
        currentStartSound.pause();
        currentStartSound.currentTime = 0;
        currentStartSound = null;
    }
}

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
        } else {inGameHelp.style.display = 'block'; }
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
  prepareUIForGameStart();
  const canvas = document.getElementById('canvas');
  if (canvas) canvas.style.display = 'none';

  init(() => {
    addCanvasClickListener(canvas);
    waitForGameInitialization(canvas);
  });
}

function prepareUIForGameStart() {
  hideStartScreen();
  handleInGameMenuDisplay();
  handleWindowResize();
  hideHeader();
  showInGameMenu();
  showPlayPauseControls();
}

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

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        startGame();
    });
});

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




