//Collection of gameobjects
var Scene = function(){
	var Scene = function(activeCamera,gameObjects){
		this.activeCamera = activeCamera;
		this.gameObjects = gameObjects;
	};
	
	Scene.prototype = {
			gameObjects:[],
			activeCamera:null,
			collisionQT:null,
			origin:new Transform(),
			update:function(gameTime){
				// this.collisionQT = new QuadTree()

				for(var i = 0; i < this.gameObjects.length; i++)
				{
					if(this.gameObjects[i].updateable)
						this.gameObjects[i].update(gameTime,this.collisionQT);
				}
			},
			draw:function(drawBatch){
				drawBatch.camera = this.activeCamera;
				drawBatch.objects = [];

				for(var i = 0; i < this.gameObjects.length; i++)
				{
					if(this.gameObjects[i].drawable)
						this.gameObjects[i].draw(drawBatch,this.origin);
				}
			},
			load:function(loadInitiator){
				this.loading = [];
				this.loadInitiator = loadInitiator;
				this.loadingCount = 0;

				for(var i = 0; i < this.gameObjects.length; i++)
				{
					if(this.gameObjects[i].loadable)
					{
						this.gameObjects[i].load(this);
						this.loading.push(this.gameObjects[i]);
						this.loadingCount++;
					}
				}	
			},
			start:function(){
				for(var i = 0; i < this.gameObjects.length; i++)
				{
					if(this.gameObjects[i].startable)
						this.gameObjects[i].start();
				}
			},
			registerLoad:function(loadedObject){
				this.loading.splice(this.loading.indexOf(loadedObject),1);

				var loadProgress = 1 - (this.loading.length / this.loadingCount);
				Messenger.broadcast('loadProgress',loadProgress);

				if(this.loading.length === 0)
					this.loadInitiator.start(this);
			}
	};
	
	return Scene;
}();