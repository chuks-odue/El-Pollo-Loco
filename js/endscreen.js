function showEndScreen(type) {
    const canvas = document.getElementById('canvas');
    const endScreen = document.getElementById('endScreen');
    const endImage = document.getElementById('endImage');

    // Use your own end images
    if (type === 'win') {
        endImage.src = 'img/img/9_intro_outro_screens/game_over/game over!.png';
    } else {
        endImage.src = 'img/img/9_intro_outro_screens/game_over/you lost.png';
    }

    canvas.classList.add('custom-hidden');         // Hide canvas
    endScreen.classList.remove('custom-hidden');   // Show endscreen
}
