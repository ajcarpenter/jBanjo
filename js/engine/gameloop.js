//Load/Unload scenes
//Start/Stop
var GameLoop = function(){
	var GameLoop = function(renderer,resourceManager,gameTime,scene){
		this.renderer = renderer;
		this.resourceManager = resourceManager;
		this.gameTime = gameTime;

		this.loadScene(scene);
	};

	GameLoop.prototype = {
		scene:null,
		renderer:null,
		resourceManager:null,
		gameTime:null,
		loop:function(gameTime){
			var self = this;
			var drawBatch = {
				camera:null, 
				objects:[]
			};
			
			self.gameTime.update();

			self.update(self.gameTime);
			self.draw(drawBatch);
			self.renderer.draw(drawBatch);

			window.setTimeout(function(){self.loop();},14);
		},
		update:function(gameTime){
			if(this.scene)
				this.scene.update(gameTime);
		},
		draw:function(drawBatch){
			if(this.scene)
				this.scene.draw(drawBatch);
		},
		loadScene:function(scene){
			this.scene = scene;			
			scene.load(this);
		},
		start:function(){
			scene.start();
			this.loop();
		}
	};

	return GameLoop;
}();