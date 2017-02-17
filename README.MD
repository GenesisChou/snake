a h5 canvas snake game demo

[demo](https://genesischou.github.io/snake/.)

*how to use*
```javascript
var game = new Game({
    //canvas element
    target: document.getElementById('snake'),
    //scene width
    width: 1100,
    //scene height
    height: 500,
    //callback when game start
    start: function () {
        console.log('game start');
    },
    //callback when game stop
    stop: function (score) {
        console.log('game score:' + game.score);
    },
    //callback when game's scoe change
    scoreChange: function (score) {
        dashboard.innerHTML = score;
    },
    //snake option including color,speed
    snake: {
        color: '#66ccff',
        speed:20
    },
    //dot option including color,width
    dot: {
        color: '#e4393c',
        width:20;
    }
});
game.start();
```
