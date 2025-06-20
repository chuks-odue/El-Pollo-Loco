document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById('infoButton');
    const infoOverlay = document.getElementById('infoOverlay');
    const closeInfoBtn = document.getElementById('closeInfoBtn'); 
    let isInfoOverlayVisible = false;    
    function closeInfoOverlay() {
        if (infoOverlay) {
            infoOverlay.style.display = 'none';
        }
        isInfoOverlayVisible = false;
    }    
    if (infoButton) {
        infoButton.addEventListener('click', () => {
            isInfoOverlayVisible = !isInfoOverlayVisible;
            if (infoOverlay) {
                infoOverlay.style.display = isInfoOverlayVisible ? 'block' : 'none';
            }
        });
    }    
    if (closeInfoBtn) { 
        closeInfoBtn.addEventListener('click', () => {
            closeInfoOverlay(); 
        });
    }    
    document.addEventListener('click', (event) => {
        if (isInfoOverlayVisible && 
            infoOverlay && 
            !infoOverlay.contains(event.target) && 
            event.target !== infoButton) 
        {
            closeInfoOverlay(); 
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
  return window.innerWidth <= 1024;
}
window.addEventListener('resize', () => {
    
    if (world) { 
        world.draw();
    }
});


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




                                            