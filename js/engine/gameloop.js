//Load/Unload scenes
//Start/Stop
var GameLoop = function(){
	var GameLoop = function(renderer,resourceManager,gameTime,scene,loadingScene){
		this.renderer = renderer;
		this.resourceManager = resourceManager;
		this.gameTime = gameTime;
		this.loadingScene = loadingScene;

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

			window.requestAnimationFrame(this.loop.bind(this));
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
			this.loaded = false;

			this.loadingScene.load(this);		
			scene.load(this);
		},
		start:function(scene){
			if(!this.loaded)
			{
				if(scene != this.loadingScene)
					this.loaded = true;

				this.scene = scene;
				scene.start();
				this.loop();
			}
		}
	};

	return GameLoop;
}();