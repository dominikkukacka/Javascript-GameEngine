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


function GameEngine() {

    this.entities           = [];
    this.ctx                = null;
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

GameEngine.prototype.addEntity = function(e) {
    this.entities.push(e);
}

GameEngine.prototype.prototype.draw = function(drawCallback) {
    
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

}

GameEngine.prototype.update = function() {

    var cnt = this.entities.sizeof;
    for(var i = 0; i < cnt; i++) {
        this.entities[i].draw(ctx);
    }

}
