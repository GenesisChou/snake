class Game {
    constructor(option) {
        this.option = option;
        this.cvs = option.target;
        this.width = this.option.width || 500;
        this.height = this.option.height || 500;
        this.cvs.width = this.width;
        this.cvs.height = this.height;
        this.ctx = this.cvs.getContext('2d');
        this.init();
     }
    init() {
        this.snake = new Snake(20, this.width, this.height, this.option.snake.color, this.option.snake.speed);
        this.dot = new Dot(this.option.dot.width, this.width, this.height, this.option.dot.color);
        this.score = 0;
        this.timer = null;
    }
    start() {
        this.init();
        if (this.option.start) {
            this.option.start();
        }
        this.render();
    }
    stop() {
        clearInterval(this.timer);
        if (this.option.stop) {
            this.option.stop(this.score);
        }
    }
    render() {
        this.timer = setInterval(() => {
            if (this.snake.isInScene()) {
                this.clearScene();
                this.drawSnake();
                this.drawDot();
                if (this.snake.touchSelf()) {
                    this.stop();
                }
                if (this.snake.touchDot(this.dot)) {
                    this.snake.eatDot(() => {
                        this.score++;
                        if (this.option.scoreChange) {
                            this.option.scoreChange(this.score);
                        }
                    });
                    this.dot = new Dot(this.option.dot.width, this.width, this.height, this.option.dot.color);
                }
                this.snake.move();
            } else {
                this.stop();
            }
        }, 50)
    }
    clearScene() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawSnake() {
        this.snake.body.forEach(dot => {
            this.ctx.fillStyle = this.snake.color;
            this.ctx.fillRect(dot.x, dot.y, this.snake.width, this.snake.width);
        })
    }
    drawDot() {
        this.ctx.fillStyle = this.dot.color;
        this.ctx.fillRect(this.dot.x, this.dot.y, this.dot.width, this.dot.width);
    }
}
class Snake {
    constructor(width = 20, limitX = 500, limitY = 500, color = '#000', speed = 10) {
        this.direction = 'right'; //up down left right
        this.color = color;
        this.speed = speed;
        this.width = width;
        this.x = 100;
        this.y = 100;
        this.limitX = limitX;
        this.limitY = limitY;
        this.body = [{
            x: this.x,
            y: this.y,
            direction: this.direction
        }];
        this.addController();
    }
    move() {
        if (this.direction == 'up') {
            this.y -= this.speed;
        } else if (this.direction == 'down') {
            this.y += this.speed;
        } else if (this.direction == 'left') {
            this.x -= this.speed;
        } else if (this.direction == 'right') {
            this.x += this.speed;
        }
        for (var i = this.body.length - 2; i >= 0; i--) {
            this.body[i + 1].x = this.body[i].x;
            this.body[i + 1].y = this.body[i].y;
            this.body[i + 1].direction = this.body[i].direction;
        }
        this.body[0].x = this.x;
        this.body[0].y = this.y;
        this.body[0].direction = this.direction;
    }
    isInScene() {
        return this.x >= 0 &&
            this.x + this.width <= this.limitX &&
            this.y >= 0 &&
            this.y + this.width <= this.limitY
    }
    touchDot(dot) {
        let distance = Math.sqrt((this.x - dot.x) * (this.x - dot.x) + (this.y - dot.y) * (this.y - dot.y));
        return distance < dot.width;
    }
    touchSelf() {
        let result = false;
        this.body.forEach((dot, $index) => {
            if ($index != 0 &&
                this.x == dot.x &&
                this.y == dot.y) {
                result = true;
            }
        })
        return result;
    }
    eatDot(eatCallback) {
        let newDot = {
            x: 0,
            y: 0
        };
        let lastDot = this.body[this.body.length - 1],
            direction = lastDot.direction,
            x = lastDot.x,
            y = lastDot.y;
        if (direction == 'right') {
            newDot.x = x - this.width;
            newDot.y = y;
        }
        if (direction == 'left') {
            newDot.x = x + this.width;
            newDot.y = y;
        }
        if (direction == 'up') {
            newDot.x = x;
            newDot.y = y + this.width;
        }
        if (direction == 'down') {
            newDot.x = x;
            newDot.y = y - this.width;
        }
        this.body.push(newDot);
        if (eatCallback) {
            eatCallback();
        }
    }
    changeDirection(direction) {
        if (this.body.length > 1) {
            if ((direction == 'left' && this.direction != 'right') ||
                (direction == 'right' && this.direction != 'left') ||
                (direction == 'up' && this.direction != 'down') ||
                (direction == 'down' && this.direction != 'up')) {
                this.direction = direction;
            }
        } else {
            this.direction = direction;
        }
    }
    addController() {
        /*
        keyCode 37 = Left
        keyCode 38 = Up
        keyCode 39 = Right
        keyCode 40 = Down
        */
        document.onkeydown = (event) => {
            var e = event || window.event || arguments.callee.caller.arguments[0],
                direction = '';
            const directions = [{
                    keyCode: 37,
                    direction: 'left'
                }, {
                    keyCode: 38,
                    direction: 'up'
                }, {
                    keyCode: 39,
                    direction: 'right'
                },
                {
                    keyCode: 40,
                    direction: 'down'
                },
            ]
            directions.forEach(item => {
                if (e && e.keyCode == item.keyCode) {
                    direction = item.direction;
                    return;
                }
            })
            if (direction) {
                this.changeDirection(direction);
            }
        };
    }
}
class Dot {
    constructor(width = 20, limitX = 500, limitY = 500, color = '#000') {
        this.width = width;
        this.color = color;
        this.x = (Math.random() * (limitX - this.width)) >> 0;
        this.y = (Math.random() * (limitY - this.width)) >> 0;
    }

}