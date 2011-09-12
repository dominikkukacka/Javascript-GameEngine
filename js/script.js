window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;
    
    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}


function GameEngine() {

    this.entities           = [];
    this.ctx                = null;
    this.timer              = new Timer();
    this.canvasWidth        = null;
    this.canvasHeight       = null;    
    this.canvasHalfWidth    = null;
    this.canvasHalfHeight   = null;

}


GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;

    this.canvasWidth        = ctx.canvas.width;
    this.canvasHalfWidth    = ctx.canvas.width / 2;
    this.canvasHeight       = ctx.canvas.height;
    this.canvasHalfHeight   = ctx.canvas.height / 2;
}

GameEngine.prototype.start = function() {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

GameEngine.prototype.addEntity = function(e) {
    this.entities.push(e);
}

GameEngine.prototype.draw = function(drawCallback) {
    
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.save();
    this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight);

    var cnt = this.entities.sizeof;
    for(var i = 0; i < cnt; i++) {
        this.entities[i].draw(ctx);
    }

    if(drawCallback) {
        drawCallback(this);
    }
    ctx.restore();

}

GameEngine.prototype.update = function() {

    var cnt = this.entities.length;
    for(var i = 0; i < cnt; i++) {
        var entity = this.entities[i];
        entity.update();
    }

}

function Game() {
    GameEngine.call(this);
    this.showOutlines = true;
    this.lives = 10;
    this.score = 0;
}
Game.prototype = new GameEngine();
Game.prototype.constructor = Game;


Game.prototype.start = function() {
    var e = new Entity(this, 0, 0); 
    e.radius = 20;
    this.addEntity(e);

    GameEngine.prototype.start.call(this);
}


function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function() {
}

Entity.prototype.draw = function(ctx) {
    if (this.game.showOutlines && this.radius) {
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.closePath();
    }
}

Entity.prototype.drawSpriteCentered = function(ctx) {
    var x = this.x - this.sprite.width/2;
    var y = this.y - this.sprite.height/2;
    ctx.drawImage(this.sprite, x, y);
}

Entity.prototype.outsideScreen = function() {
    return (this.x > this.game.halfCanvasWidth || this.x < -(this.game.halfCanvasWidth) ||
        this.y > this.game.halfCanvaseight || this.y < -(this.game.halfCanvasHeight));
}


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var game = new Game();

game.init(ctx);
game.start();

