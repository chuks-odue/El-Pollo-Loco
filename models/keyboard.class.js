class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    DOWN = false;
    UP = false;
    D = false;

    touchStartX = 0;

    constructor() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.LEFT = true;
                    break;
                case 'ArrowRight':
                    this.RIGHT = true;
                    break;
                case ' ':
                    this.SPACE = true;
                    break;
                case 'ArrowDown':
                    this.DOWN = true;
                    break;
                case 'ArrowUp':
                    this.UP = true;
                    break;
                case 'd':
                    this.throwBottle();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.LEFT = false;
                    break;
                case 'ArrowRight':
                    this.RIGHT = false;
                    break;
                case ' ':
                    this.SPACE = false;
                    break;
                case 'ArrowDown':
                    this.DOWN = false;
                    break;
                case 'ArrowUp':
                    this.UP = false;
                    break;
            }
        });

        document.addEventListener('touchmove', (event) => {
            let touchMoveX = event.touches[0].clientX;
            if (touchMoveX < this.touchStartX - 10) {
                this.LEFT = true;
                this.RIGHT = false;
            } else if (touchMoveX > this.touchStartX + 10) {
                this.RIGHT = true;
                this.LEFT = false;
            }
        });

        document.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
        });

        document.addEventListener('touchend', () => {
            this.LEFT = false;
            this.RIGHT = false;
        });

        
    }   

    throwBottle() {
        
        this.D = true;
        setTimeout(() => {
            this.D = false;
        }, 100);
    }
}