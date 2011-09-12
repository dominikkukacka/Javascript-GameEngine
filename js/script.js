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

    this.entities       = [];
    this.ctx            = null;
    this.canvasWidth    = null;
    this.canvasHeight   = null;    

}


GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.canvasWdith = ctx.canvas.width;
    this.canvasHeight = ctx.canvas.height;
}
