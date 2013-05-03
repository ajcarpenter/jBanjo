//Collection of gameobjects
var Scene = function(){
	var Scene = function(activeCamera,gameObjects,prefabs){
		this.activeCamera = activeCamera;
		this.gameObjects = gameObjects || [];
		this.prefabs = prefabs || [];
		this.collision = new Collision({x:100,y:100},3);

		Messenger.addListener('destroy object',this.onDestroyObject,this);
	};
	
	Scene.prototype = {
			gameObjects:[],
			activeCamera:null,
			collision:null,
			origin:new Transform(),
			update:function(gameTime){
				Messenger.broadcast('tick',gameTime);

				this.collision.reset();
				Messenger.broadcast('build collision',this.collision);
				Messenger.broadcast('check collision',this.collision);
			},
			draw:function(drawBatch){
				drawBatch.camera = this.activeCamera;
				drawBatch.objects = [];

				var bounds = drawBatch.camera.camera.getVisibleAABB();

				drawBatch.bounds = bounds;

				for(var i = 0; i < this.gameObjects.length; i++)
				{
					if(this.gameObjects[i].drawable)
						this.gameObjects[i].draw(drawBatch,this.origin,bounds);
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

				for(var i = 0; i < this.prefabs.length; i++)
				{
					if(this.prefabs[i].loadable)
					{
						this.prefabs[i].load(this);
						this.loading.push(this.prefabs[i]);
						this.loadingCount++;
					}
				}	
			},
			start:function(){
				Messenger.broadcast('start');
			},
			registerLoad:function(loadedObject){
				this.loading.splice(this.loading.indexOf(loadedObject),1);

				var loadProgress = 1 - (this.loading.length / this.loadingCount);
				Messenger.broadcast('loadProgress',loadProgress);

				if(this.loading.length === 0)
					this.loadInitiator.start(this);
			},
			onDestroyObject:function(obj){
				this.gameObjects.splice(this.gameObjects.indexOf(obj),1);
			},
			addGameObject:function(obj){
				this.gameObjects.push(obj);
			}
	};
	
	return Scene;
}();