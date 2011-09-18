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


randomFromTo = function(from, to){
   return Math.floor(Math.random() * (to - from + 1) + from);
};


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
        //requestAnimFrame(gameLoop, that.ctx.canvas);
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
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.ctx.save();
    this.ctx.translate(this.canvasHalfWidth, this.canvasHalfHeight);

    var cnt = this.entities.length;
    for(var i = 0; i < cnt; i++) {
        var entity = this.entities[i];
        if(!entity.removeFromCanvas)
            entity.draw(this.ctx);
    }

    if(drawCallback) {
        drawCallback(this);
    }
    ctx.restore();

}

GameEngine.prototype.update = function() {
    var cnt = this.entities.length;

    for(var i = cnt - 1; i >= 0; i--) {
        var entity = this.entities[i];

        if(entity.removeFromCanvas) {
            this.entities.splice(i,1);
        } else {
            entity.update();
        }
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
    this.ship = new Ship(this);
    this.addEntity(this.ship);

	for(var i = 0; i < 10; i++) {
		var x = randomFromTo(-this.canvasHalfWidth + 10, this.canvasHalfWidth - 10);
		var y = randomFromTo(-this.canvasHalfHeight+10, this.canvasHalfHeight - 10);
		var ast1 = new Asteroid(this, x, y ); 
		this.addEntity(ast1);  
	}
    GameEngine.prototype.start.call(this);
}

Game.prototype.draw = function() {
	GameEngine.prototype.draw.call(this, function(game) {
    });

}


function Entity(game, x, y, polygons, color) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.polygons = polygons || [];
	this.color = color || [161, 245, 27];
	//this.color = [255,255,255];
    this.removeFromCanvas = false;
}

Entity.prototype.update = function() {
}

Entity.prototype.draw = function(ctx) {

    if( this.polygons && this.polygons.length > 0 ) {
        ctx.shadowOffsetX = 0;  
        ctx.shadowOffsetY = 0;  
        ctx.shadowBlur = 15;  
        ctx.shadowColor = "rgba("+this.color[0]+", "+this.color[1]+", "+this.color[2]+", 0.5)";

        ctx.lineWidth = 2; 
        ctx.strokeStyle = "rgba("+this.color[0]+", "+this.color[1]+", "+this.color[2]+", 1)";
        ctx.fillStyle =  "rgba(0,0,0,1)";

        ctx.beginPath();
        for(i in this.polygons) {
            var poly = this.polygons[i];
            //console.log(poly);

            if(i === 0) {      
                ctx.moveTo(this.x + poly[0], this.y + poly[1]);
            } else {
                ctx.lineTo(this.x + poly[0], this.y + poly[1]);
            }
        }
        ctx.closePath();
        
        ctx.stroke();
        ctx.fill();
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





function Ship(game) {
    Entity.call(this, game, 0, 0, [[0,0],[7,22],[-7,22]]);
}

Ship.prototype = new Entity();
Ship.prototype.constructor = Ship;

function Asteroid(game, x, y) {

	var rand1 = Math.random()*21;
	if(rand1>10)
		rand1 = -(rand1 - 10);

	var rand2 = Math.random()*21;
	if(rand2>10)
		rand2 = -(rand2 - 10);

    Entity.call(
		this, 
		game, 
		x, 
		y, 
		[[0+rand1,0],[5,-1+rand2],[9,5],[9+rand1,7+rand2],[2,10],[0,11+rand2],[-5+rand1,7],[-3,2+rand2],[-4,5],[-5+rand1,0+rand2]],
		[245, 27, 27] 
	);
}

Asteroid.prototype = new Entity();
Asteroid.prototype.constructor = Asteroid;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var game = new Game();

game.init(ctx);
game.start();

