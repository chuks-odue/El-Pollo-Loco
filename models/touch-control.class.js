class TouchControls {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.leftArrowIcon = new Image();
        this.leftArrowIcon.src = 'img/assets/chevron_left.svg';
        this.rightArrowIcon = new Image();
        this.rightArrowIcon.src = 'img/assets/keyboard_arrow_right.svg';
        this.upArrowIcon = new Image();
        this.upArrowIcon.src = 'img/assets/arrow-up-white.svg';
        this.throwIcon = new Image();
        this.throwIcon.src = 'img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    }

    draw() {
        // Draw left button
// Draw left button
this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
this.ctx.beginPath();
this.ctx.roundRect(28, this.canvas.height - 52, 40, 40, 10);
this.ctx.fill();
this.ctx.drawImage(this.leftArrowIcon, 22, this.canvas.height - 58, 50, 50);

// Draw right button
this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
this.ctx.beginPath();
this.ctx.roundRect(88, this.canvas.height - 52, 40, 40, 10);
this.ctx.fill();
this.ctx.drawImage(this.rightArrowIcon, 85, this.canvas.height - 58, 50, 50);

// Draw jump button
this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
this.ctx.beginPath();
this.ctx.roundRect(this.canvas.width - 157, this.canvas.height - 52, 40, 40, 10);
this.ctx.fill();
this.ctx.drawImage(this.upArrowIcon, this.canvas.width - 163, this.canvas.height - 54, 50, 50);

// Draw throw button
this.ctx.fillStyle = 'rgba(0, 49, 55, 0.87)';
this.ctx.beginPath();
this.ctx.roundRect(this.canvas.width - 67, this.canvas.height - 52, 40, 40, 10);
this.ctx.fill();
this.ctx.drawImage(this.throwIcon, this.canvas.width - 70, this.canvas.height - 62, 50, 50);
    }
        handleTouchEvents(canvas, keyboard) {
        canvas.addEventListener('touchstart', (event) => {
            let rect = canvas.getBoundingClientRect();
            let x = event.touches[0].clientX - rect.left;
            let y = event.touches[0].clientY - rect.top;

            if (x > 12 && x < 82 && y > this.canvas.height - 70 && y < this.canvas.height) {
                keyboard.LEFT = true;
            } else if (x > 75 && x < 145 && y > this.canvas.height - 70 && y < this.canvas.height) {
                keyboard.RIGHT = true;
            } else if (x > this.canvas.width - 173 && x < this.canvas.width - 103 && y > this.canvas.height - 70 && y < this.canvas.height) {
                keyboard.UP = true;
            } else if (x > this.canvas.width - 95 && x < this.canvas.width - 25 && y > this.canvas.height - 70 && y < this.canvas.height) {
                const throwEvent = new CustomEvent('throwBottle');
                document.dispatchEvent(throwEvent);
            }
        });

        canvas.addEventListener('touchend', (event) => {
            keyboard.LEFT = false;
            keyboard.RIGHT = false;
            keyboard.UP = false;
        });
    }

}