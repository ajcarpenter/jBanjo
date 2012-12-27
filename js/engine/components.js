var ComponentType = {
	Transform:'transform',
	SpriteRenderer:'spriteRenderer',
	PolyRenderer:'polyRenderer',
	ParticleRenderer:'particleRenderer',
	SquareCollider:'squareCollider',
	CircleCollider:'circleCollider',
	AudioEmitter:'audioEmitter',
	Script:'script',
	Camera:'camera',
	Animation:'animation'
};

var Component = function(){
	var Component = function(paramMap){
		return this;
	};
	
	Component.prototype = {
		type:null,
		enabled:true,
		instantiate:function(paramMap){
			return new Component(paramMap);
		}
	};
	
	return Component;
}();

//
var Transform = function(){
	var Transform = function(paramMap){
		if(paramMap)
		{
			this.position = paramMap.position || $V([0,0,0]);
			this.scale = paramMap.scale || $V([1,1]);
			this.rotation = paramMap.rotation || 0;
		}
		else
		{
			this.position = $V([0,0,0]);
			this.scale = $V([1,1]);
			this.rotation = 0;
		}
	};
	
	Transform.prototype = {
		instantiate:function(paramMap){
			return new Transform(paramMap);
		},
		type:ComponentType.Transform,
		position:null,
		scale:null,
		rotation:null,
		toWorld:function(parentTransform){
			//TODO: Fix this
			var pos = this.position.add(parentTransform.position);

			return new Transform({position:pos});
		}
	};

	_inherit(Transform,Component);
	
	return Transform;
}();

//Renderers
var Renderer = function(){
	var Renderer = function(){
		
	};
	
	Renderer.prototype = {
		zindex:0
	};
	
	_inherit(Renderer,Component);
	
	return Renderer;
}();

var SpriteRenderer = function(){
	var SpriteRenderer = function(paramMap){
		if(paramMap)
		{
			this.zindex = paramMap.zindex;
			this.src = paramMap.src;//'./sprites/gb_walk.png';
			this.spriteSheetSize = paramMap.spriteSheetSize;
		}

		this.AABB = new AABB();
	};
	
	SpriteRenderer.prototype = {
		instantiate:function(paramMap){
			return new SpriteRenderer(paramMap);
		},
		type:ComponentType.SpriteRenderer,
		spriteSheet:null,
		spriteSheetSize:{x:1,y:1},
		frameData:null,
		currentFrame:0,
		width:null,
		height:null,
		src:null,
		draw:function(drawBatch,transform){
			if(!drawBatch.objects[this.zindex])
				drawBatch.objects[this.zindex] = [];

			drawBatch.objects[this.zindex].push({
				img:this.spriteSheet,
				trans:transform,
				crop:this.getCrop(this.currentFrame)
			});
		},
		getCrop:function(frame){
			var row = Math.floor(frame / this.spriteSheetSize.x);
			var col = frame % this.spriteSheetSize.x;

			return {
				x:(this.spriteSheet.width / this.spriteSheetSize.x) * col,
				y:(this.spriteSheet.height / this.spriteSheetSize.y) * row,
				width:this.width,
				height:this.height
			}
		},
		load:function(loadInitiator)
		{
			var self = this;

			ResourceManager.get(ResourceType.image, this.src, function(data){
				self.spriteSheet = data;
				self.width = Math.floor(data.width / self.spriteSheetSize.x);
				self.height = Math.floor(data.height / self.spriteSheetSize.y)
				loadInitiator.registerLoad(self);
			});
		}
	};
	
	_inherit(SpriteRenderer,Renderer);
	
	return SpriteRenderer;
}();

var PolyRenderer = function(){
	
}();

var ParticleRenderer = function(){
	
}();


//Colliders
var Collider = function(){
	var Collider = function(){
		
	};
	
	Collider.prototype = {
			
	};
	
	_inherit(Collider,Component);
	
	return Collider;
}();

var SquareCollider = function(){
	
}();

var CircleCollider = function(){
	
}();

//Audio
var AudioEmitter = function(){
	
}();

//Scripting
var Script = function(){
	var Script = function(paramMap){
		if(paramMap)
		{
			this.update = paramMap.update;
			this.start = paramMap.start;
		}
	};

	Script.prototype = {
		instantiate:function(paramMap){
			return new Script(paramMap);
		},
		script:null,
		update:function(){},
		type:ComponentType.Script
	};

	_inherit(Script,Component)

	return Script;
}();

//Cameras
var Camera = function(){
	var Camera = function(){

	};

	Camera.prototype = {
		AABB:null,
		viewportSize:$V([1920,1080]),
		type:ComponentType.Camera
	};

	_inherit(Camera,Component);

	return Camera;
}();

//Animations
var Animation = function(){
	var Animation = function(paramMap){
		if(paramMap)
		{
			this.componentType = paramMap.componentType;
			this.property = paramMap.property;
			this.length = paramMap.length;
			this.keyFrameSets = paramMap.keyFrameSets;
			this.loop = paramMap.loop;
			this.defaultVal = paramMap.defaultVal;
		}
	};

	Animation.prototype = {
		instantiate:function(paramMap){
			return new Animation(paramMap);
		},
		type:ComponentType.Animation,
		length:null,
		loop:false,
		keyFrameSets:null,
		component:null,
		componentType:null,
		property:null,
		startTime:null,
		loopStart:null,
		currentFrame:null,
		running:false,
		defaultVal:0,
		loadedSet:0,
		start:function(){
			this.startTime = new Date();
			this.loopStart = new Date();
			this.currentFrame = 0;
			this.running = true;
		},
		stop:function(){
			this.running = false;
		},
		update:function(gameObject,gameTime){
			if(!this.component || this.component.type != this.componentType)
				this.component = gameObject.getComponentByType(this.componentType);

			if(this.component)
				this.component[this.property] = this.getFrame(gameTime);
		},
		getFrame:function(gameTime){
			if(this.running)
			{
				var t = (gameTime.now - this.loopStart);

				if(t >= this.length && this.loop)
				{
					this.currentFrame = 0;
					this.loopStart = new Date();
				}
				else
				{
					for(var i = this.currentFrame; i < this.keyFrameSets[this.loadedSet].length; i++)
					{
						if(t > this.keyFrameSets[this.loadedSet][i].time && t < (this.keyFrameSets[this.loadedSet][i + 1] ? this.keyFrameSets[this.loadedSet][i + 1].time : this.length))
							this.currentFrame = i;
					}
				}

				return this.keyFrameSets[this.loadedSet][this.currentFrame].value;
			}
			else
				return this.defaultVal;
		},
		switchKeyFrameSet:function(i,defaultVal){
			this.loadedSet = i;
			this.defaultVal = defaultVal;
		}
	};

	_inherit(Animation,Component);

	return Animation;
}();