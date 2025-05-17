document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
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
        
        document.getElementById('startScreen').style.display = 'none';
        document.querySelector('h1').style.display = 'none'; 
        
    
        canvas.style.display = 'block';
        document.getElementById('inGameMenu').classList.remove('hidden');    
        document.getElementById('inGameHelp').style.display = 'block';
        document.getElementById('restartButton').style.display = 'block';
        
        init(); 
    }
    startButton.addEventListener('click', () => {
        startGame();
    });
});


let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;



// Initialize game
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); // Ensure level1 is loaded
    world = new World(canvas, keyboard);
    console.log('my character is', world.character);
}

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

    if (infoButton) {
        infoButton.addEventListener('click', () => {
            infoOverlay.style.display = 'block';
        });
    }

    if (closeInfoOverlay) {
        closeInfoOverlay.addEventListener('click', () => {
            infoOverlay.style.display = 'none';
        });
    }

    document.addEventListener('click', (event) => {
        if (infoOverlay.style.display === 'block' && !infoOverlay.contains(event.target) && event.target !== infoButton) {
            infoOverlay.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const restartButton = document.getElementById('restartButton');
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
            ? 'img/assets/fullscreen_exit_24.svg'
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

    // Rest of your code remains the same
    restartButton.addEventListener('click', restartGame);

    soundButtonInGame.addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        console.log('Sound enabled:', soundEnabled);
        soundIconInGame.src = soundEnabled 
            ? 'img/assets/Mic-On.svg' 
            : 'img/assets/Mic-Off.svg';
        e.stopPropagation();
    });
});
function restartGame() {
    if (world && typeof world.stop === 'function') {
        world.stop(); 
    }

    keyboard = new Keyboard();   
    initLevel();                 
     world = new World(canvas, keyboard); 
    console.log('Game restarted');
}