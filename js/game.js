document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
        function startGame() {
        const startSound = new Audio('audio/S31-Winning the Race.ogg');
        startSound.volume = 0.5;
        startSound.play().catch(err => console.error('Failed to play start sound:', err));        
        setTimeout(() => {
            startSound.pause();
            startSound.currentTime = 0;
        }, 3000);     
        
        document.getElementById('startScreen').style.display = 'none';
        document.querySelector('h1').style.display = 'none'; 

        canvas.style.display = 'block';
        document.getElementById('inGameMenu').classList.remove('hidden');    
        init(); 
    }
        startButton.addEventListener('click', () => {
        startGame();
    });
});


let canvas;
let world;
let keyboard = new Keyboard();



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
    if (e.key === " ") keyboard.SPACE = true;
    if (e.key === "ArrowDown") keyboard.DOWN = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key.toLowerCase() === 'd') keyboard.D = true;
});

// Keyup event listener
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === " ") keyboard.SPACE = false;
    if (e.key === "ArrowDown") keyboard.DOWN = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key.toLowerCase() === 'd') keyboard.D = false;
});

// (Optional but unused) custom event listener — can be removed if not used elsewhere
window.addEventListener("keynotpress", (e) => {
    keyboard[e.key] = false;
});


document.addEventListener('DOMContentLoaded', () => {
    const soundButton = document.getElementById('soundButton');
    const settingsPanel = document.getElementById('settingsPanel');
    const toggleSoundBtn = document.getElementById('toggleSoundBtn');
    const soundIcon = document.getElementById('soundIcon');

    let soundEnabled = false;

    // Show/Hide settings panel
    soundButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling to document
        settingsPanel.classList.toggle('hidden');
    });

    // Toggle sound state
    toggleSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        soundIcon.src = soundEnabled ? 'img/assets/Mic-Off.svg' : 'img/assets/Mic-On.svg';
        toggleSoundBtn.innerText = soundEnabled ? 'Enable Sound' : 'Disable Sound';
        toggleSoundBtn.prepend(soundIcon);
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsPanel.classList.contains('hidden')) {
            if (!settingsPanel.contains(e.target) && e.target !== soundButton) {
                settingsPanel.classList.add('hidden');
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // ...existing sound/setting panel code

    const helpButton = document.getElementById('helpButton');
    const helpPopup = document.getElementById('helpPopup');

    helpButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing immediately
        helpPopup.classList.toggle('hidden');
    });

    // Close help popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!helpPopup.classList.contains('hidden')) {
            if (!helpPopup.contains(e.target) && e.target !== helpButton) {
                helpPopup.classList.add('hidden');
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const restartButton = document.getElementById('restartButton');
    const canvas = document.getElementById('canvas');

    fullscreenButton.addEventListener('click', () => {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    });

    restartButton.addEventListener('click', () => {
        restartGame(); // ✅ Soft restart
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












