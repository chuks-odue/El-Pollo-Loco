let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

// Initialize game
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); 
    world = new World(canvas, keyboard);
    console.log('my character is', world.character);
    
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

function handleWindowResize() {
    window.addEventListener('resize', () => {
        const inGameMenu = document.getElementById('inGameMenu');
        if (window.innerWidth <= 1020) {
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
    init();
    addCanvasClickListener(canvas);
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

// (Optional but unused) custom event listener — can be removed if not used elsewhere
window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');    
    let isInfoOverlayVisible = false;
    if (infoButton) {
        infoButton.addEventListener('click', () => {
            isInfoOverlayVisible = !isInfoOverlayVisible;
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






































/*let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

// Initialize game
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); 
    world = new World(canvas, keyboard);
    console.log('my character is', world.character);
    
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

function handleWindowResize() {
    window.addEventListener('resize', () => {
        const inGameMenu = document.getElementById('inGameMenu');
        if (window.innerWidth <= 1020) {
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

function addCanvasClickListener(canvas) {
    if (!canvas._clickHandlerAdded) {
        canvas.addEventListener('click', function (event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
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
        });
        canvas._clickHandlerAdded = true; // Prevent adding multiple listeners
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
    init();
    addCanvasClickListener(canvas);
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

// (Optional but unused) custom event listener — can be removed if not used elsewhere
window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});
function toggleInfoOverlay(infoOverlay, isInfoOverlayVisible) {
    infoOverlay.style.display = isInfoOverlayVisible ? 'block' : 'none';
}

function handleInfoButton(infoButton, infoOverlay) {
    infoButton.addEventListener('click', () => {
        infoOverlay.style.display = infoOverlay.style.display === 'block' ? 'none' : 'block';
    });
}

function handleCloseInfoOverlay(closeInfoOverlay, infoOverlay) {
    closeInfoOverlay.addEventListener('click', () => {
        infoOverlay.style.display = 'none';
    });
}

function handleOutsideClick(infoOverlay, infoButton) {
    document.addEventListener('click', (event) => {
        if (infoOverlay.style.display === 'block' && !infoOverlay.contains(event.target) && event.target !== infoButton) {
            infoOverlay.style.display = 'none';
        }
    });
}

function setupInfoOverlay() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');
    const closeInfoOverlay = document.getElementById('closeInfoOverlay');

    if (infoButton && infoOverlay && closeInfoOverlay) {
        handleInfoButton(infoButton, infoOverlay);
        handleCloseInfoOverlay(closeInfoOverlay, infoOverlay);
        handleOutsideClick(infoOverlay, infoButton);
    }
}

document.addEventListener('DOMContentLoaded', setupInfoOverlay);


document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const soundButtonInGame = document.getElementById('soundButtonInGame');
    const soundIconInGame = document.getElementById('soundIconInGame');
    const gameContainer = document.querySelector('.game-container'); // Changed to container
    const canvas = document.getElementById('canvas');

    // Fullscreen functionality
    function toggleFullscreen() {
        if (!isFullscreen()) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }

    function isFullscreen() {
        // Check if game container is the fullscreen element
        return !!(
            document.fullscreenElement === gameContainer ||
            document.webkitFullscreenElement === gameContainer ||
            document.mozFullScreenElement === gameContainer ||
            document.msFullscreenElement === gameContainer
        );
    }

    function enterFullscreen() {
        try {
            if (gameContainer.requestFullscreen) { // Changed to gameContainer
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

    function updateFullscreenIcon() {
        const iconPath = isFullscreen() 
            ? 'img/assets/fullscreen_exit.svg'
            : 'img/assets/fullscreen_icon.svg';
        
        // Verify icon exists before setting source
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

    // Event listeners
    fullscreenButton.addEventListener('click', toggleFullscreen);
    
    // Fullscreen change events
    [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ].forEach(event => {
        document.addEventListener(event, updateFullscreenIcon);
    });

    // Initial setup
    updateFullscreenIcon();

   
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
});
*/





























































/*let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;

// Initialize game
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); 
    world = new World(canvas, keyboard);
    console.log('my character is', world.character);
    
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
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    let canvas; 
    function startGame() {
        console.log('Starting game, sound enabled:', soundEnabled);

        if (soundEnabled) {
            const startSound = new Audio('audio/S31-Winning the Race.ogg');
            startSound.volume = 0.5;
            startSound.play().catch(err => console.error('Failed to play start sound:', err));        
            setTimeout(() => {
                startSound.pause();
                startSound.currentTime = 0;
            }, 3000);     
        }
        
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.style.display = 'none';
            canvas = document.getElementById('canvas'); 
            if (canvas) canvas.style.display = 'block';
        } else {
            canvas = document.getElementById('canvas'); 
            if (canvas) canvas.style.display = 'block';
        }
         document.body.classList.add('game-started');
      if (window.innerWidth <= 920) {
    const inGameHelp = document.getElementById('inGameHelp');
    if (inGameHelp) {
        inGameHelp.style.display = 'none';
    }

    const inGameMenu = document.getElementById('inGameMenu');
    if (inGameMenu) {
        inGameMenu.style.display = 'none';
    }
}

window.addEventListener('resize', () => {
    const inGameMenu = document.getElementById('inGameMenu');
    if (window.innerWidth <= 1020) {
        inGameMenu.classList.add('hide-on-mobile');
    } else {
        inGameMenu.classList.remove('hide-on-mobile');
    }
});


          



        
        const h1 = document.querySelector('h1');
        if (h1) h1.style.display = 'none'; 
        
        const inGameMenu = document.getElementById('inGameMenu');
        if (inGameMenu) inGameMenu.classList.remove('hidden');    
            
        const inGameHelp = document.getElementById('inGameHelp');
        if (inGameHelp) inGameHelp.style.display = 'block';
            
        const playPauseControls = document.getElementById('play-pause-controls');
        if (playPauseControls) playPauseControls.style.display = 'block';        

        init();

        if (canvas) {
            canvas.addEventListener('click', (e) => {
                let rect = canvas.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;
                if (world.gameOver) {
                    world.restartButton.handleClick(x, y);
                } else {
                    world.playPauseButton.handleClick(x, y, world);
                }
            });
        }
    }
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

// (Optional but unused) custom event listener — can be removed if not used elsewhere
window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});
document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');
    const closeInfoOverlay = document.getElementById('closeInfoOverlay');
    let isInfoOverlayVisible = false;

    if (infoButton) {
        infoButton.addEventListener('click', () => {
            isInfoOverlayVisible = !isInfoOverlayVisible;
            infoOverlay.style.display = isInfoOverlayVisible ? 'block' : 'none';
        });
    }

    if (closeInfoOverlay) {
        closeInfoOverlay.addEventListener('click', () => {
            infoOverlay.style.display = 'none';
            isInfoOverlayVisible = false;
        });
    }

    document.addEventListener('click', (event) => {
        if (isInfoOverlayVisible && !infoOverlay.contains(event.target) && event.target !== infoButton) {
            infoOverlay.style.display = 'none';
            isInfoOverlayVisible = false;
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const soundButtonInGame = document.getElementById('soundButtonInGame');
    const soundIconInGame = document.getElementById('soundIconInGame');
    const gameContainer = document.querySelector('.game-container'); // Changed to container
    const canvas = document.getElementById('canvas');

    // Fullscreen functionality
    function toggleFullscreen() {
        if (!isFullscreen()) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }

    function isFullscreen() {
        // Check if game container is the fullscreen element
        return !!(
            document.fullscreenElement === gameContainer ||
            document.webkitFullscreenElement === gameContainer ||
            document.mozFullScreenElement === gameContainer ||
            document.msFullscreenElement === gameContainer
        );
    }

    function enterFullscreen() {
        try {
            if (gameContainer.requestFullscreen) { // Changed to gameContainer
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

    function updateFullscreenIcon() {
        const iconPath = isFullscreen() 
            ? 'img/assets/fullscreen_exit.svg'
            : 'img/assets/fullscreen_icon.svg';
        
        // Verify icon exists before setting source
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

    // Event listeners
    fullscreenButton.addEventListener('click', toggleFullscreen);
    
    // Fullscreen change events
    [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ].forEach(event => {
        document.addEventListener(event, updateFullscreenIcon);
    });

    // Initial setup
    updateFullscreenIcon();

   
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
});
*/