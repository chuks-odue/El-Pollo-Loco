/**
 * Flag to track the visibility of the info overlay.
 * @type {boolean}
 */
let isInfoOverlayVisible = false;

/**
 * Retrieves the info overlay element.
 * @returns {HTMLElement|null} The info overlay element.
 */
function getInfoOverlay() {
    return document.getElementById('infoOverlay');
}

/**
 * Retrieves the info button element.
 * @returns {HTMLElement|null} The info button element.
 */
function getInfoButton() {
    return document.getElementById('infoButton');
}

/**
 * Retrieves the close info button element.
 * @returns {HTMLElement|null} The close info button element.
 */
function getCloseInfoButton() {
    return document.getElementById('closeInfoBtn');
}

/**
 * Shows the info overlay.
 */
function showInfoOverlay() {
    const infoOverlay = getInfoOverlay();
    if (infoOverlay) {
        infoOverlay.style.display = 'block';
        isInfoOverlayVisible = true;
    }
}

/**
 * Hides the info overlay.
 */
function hideInfoOverlay() {
    const infoOverlay = getInfoOverlay();
    if (infoOverlay) {
        infoOverlay.style.display = 'none';
        isInfoOverlayVisible = false;
    }
}

/**
 * Toggles the visibility of the info overlay.
 */
function toggleInfoOverlay() {
    if (isInfoOverlayVisible) {
        hideInfoOverlay();
    } else {
        showInfoOverlay();
    }
}

/**
 * Sets up the event listener for the info button.
 */
function setupInfoButtonListener() {
    const infoButton = getInfoButton();
    if (infoButton) {
        infoButton.addEventListener('click', toggleInfoOverlay);
    }
}

/**
 * Sets up the event listener for the close info button.
 */
function setupCloseButtonListener() {
    const closeInfoBtn = getCloseInfoButton();
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', hideInfoOverlay);
    }
}

/**
 * Sets up the event listener for document clicks.
 */
function setupDocumentClickListener() {
    document.addEventListener('click', function (event) {
        const infoOverlay = getInfoOverlay();
        const infoButton = getInfoButton();
        if (
            isInfoOverlayVisible &&
            infoOverlay &&
            !infoOverlay.contains(event.target) &&
            event.target !== infoButton
        ) {
            hideInfoOverlay();
        }
    });
}

/**
 * Initializes the info overlay.
 */
function initializeInfoOverlay() {
    setupInfoButtonListener();
    setupCloseButtonListener();
    setupDocumentClickListener();
}

document.addEventListener('DOMContentLoaded', initializeInfoOverlay);

/**
 * Toggles fullscreen mode for the game container.
 * @param {HTMLElement} gameContainer The game container element.
 */
function toggleFullscreen(gameContainer) {
    if (!isFullscreen(gameContainer)) {
        enterFullscreen(gameContainer);
    } else {
        exitFullscreen();
    }
}

/**
 * Checks if the game container is in fullscreen mode.
 * @param {HTMLElement} gameContainer The game container element.
 * @returns {boolean} True if in fullscreen mode, false otherwise.
 */
function isFullscreen(gameContainer) {
    return !!(
        document.fullscreenElement === gameContainer ||
        document.webkitFullscreenElement === gameContainer ||
        document.mozFullScreenElement === gameContainer ||
        document.msFullscreenElement === gameContainer
    );
}

/**
 * Enters fullscreen mode for the game container.
 * @param {HTMLElement} gameContainer The game container element.
 */
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

/**
 * Exits fullscreen mode.
 */
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

/**
 * Updates the fullscreen icon based on the current fullscreen state.
 * @param {HTMLElement} fullscreenIcon The fullscreen icon element.
 * @param {boolean} isFullscreenIcon True if the icon should be in fullscreen mode, false otherwise.
 */
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

/**
 * Handles the fullscreen button click event.
 * @param {HTMLElement} fullscreenButton The fullscreen button element.
 * @param {HTMLElement} gameContainer The game container element.
 * @param {HTMLElement} fullscreenIcon The fullscreen icon element.
 */
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

/**
 * Handles the sound button click event.
 * @param {HTMLElement} soundButtonInGame The sound button element.
 * @param {HTMLElement} soundIconInGame The sound icon element.
 */
function handleSoundButton(soundButtonInGame, soundIconInGame) {
    soundButtonInGame.addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        if (world) {world.soundEnabled = soundEnabled;}
                soundIconInGame.src = soundEnabled
            ? 'img/assets/Mic-On.svg'
            : 'img/assets/Mic-Off.svg';
        e.stopPropagation();
    });    
    soundIconInGame.src = soundEnabled
        ? 'img/assets/Mic-On.svg'
        : 'img/assets/Mic-Off.svg';
}

/**
 * Sets up the game controls.
 */
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

/**
 * Checks if the screen size is small.
 * @returns {boolean} True if the screen size is small, false otherwise.
 */
function isSmallScreen() {
  return window.innerWidth <= 1024;
}

window.addEventListener('resize', () => {
    
    if (world) { 
        world.draw();
    }
});

/**
 * Checks the orientation and screen size.
 */
function checkOrientationAndScreenSize() {
  const rotateOverlay = document.getElementById('rotateOverlay');
  const canvas = document.querySelector('canvas'); 
  if (rotateOverlay && canvas) {
    if (window.innerWidth <= 720 && window.innerHeight > window.innerWidth) {      
      rotateOverlay.style.display = 'flex';
      canvas.style.display = 'none';
    } else {      
      rotateOverlay.style.display = 'none';
      canvas.style.display = 'block';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    checkOrientationAndScreenSize(); 
    window.addEventListener('orientationchange', checkOrientationAndScreenSize);
    window.addEventListener('resize', checkOrientationAndScreenSize);
});

