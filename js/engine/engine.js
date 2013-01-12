var Engine = function(){
	var Engine = function(canvas,scenes,loadingScene){
		this.scenes = scenes;
		this.GameTime.start();
		this.renderer = new Renderer(canvas.getContext('2d'),canvas.height,canvas.width);
		this.loop = new GameLoop(this.renderer,this.resourceManager,this.GameTime,scenes[0],loadingScene);
	};
	
	Engine.prototype = {
			loop:null,
			renderer:null,
			resourceManager:null,
			context:null,
			scenes:[],
			GameTime:{
				started:null,
				now:null,
				start:function(){
					this.started = performance.now();
				},
				update:function(){
					var newTime = performance.now();
					this.deltaTime = (newTime - this.now) / 1000; //Convert to seconds
					this.now = newTime;
				},
				deltaTime:null
			},
			loadScene:function(i){
				this.loop.loadScene(scenes[i]);
			}
	};
	
	return Engine;
}();