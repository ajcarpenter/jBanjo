var ComponentType = {
	Transform:'transform',
	SpriteRenderer:'spriteRenderer',
	PolyRenderer:'polyRenderer',
	ParticleRenderer:'particleRenderer',
	Collider:'collider',
	SquareCollider:'squareCollider',
	CircleCollider:'circleCollider',
	AudioEmitter:'audioEmitter',
	Script:'script',
	Camera:'camera',
	Animation:'animation'
};

var Component = function(){
	var Component = function(parent,paramMap){
		this.parent = parent;

		this.setProperties(paramMap);
	};
	
	Component.prototype = {
		gameObject:null,
		type:null,
		enabled:true,
		parent:null,
		instantiate:function(parent,paramMap){
			return new Component(parent,paramMap);
		},
		enable:function(){

		},
		disable:function(){

		},
		destroy:function(){

		},
		setProperties:function(paramMap){

		}
	};
	
	return Component;
}();

//
var Transform = function(){
	var Transform = function(parent,paramMap){
		this._super(parent,paramMap);
	};
	
	Transform.prototype = {
		instantiate:function(parent,paramMap){
			return new Transform(parent,paramMap);
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				this.position = paramMap.position || $V([0,0]);
				this.scale = paramMap.scale || $V([1,1]);
				this.rotation = paramMap.rotation || 0; //radians
			}
			else
			{
				this.position = $V([0,0]);
				this.scale = $V([1,1]);
				this.rotation = 0;
			}
		},
		type:ComponentType.Transform,
		position:null,
		scale:null,
		rotation:null,
		toWorld:function(parentTransform){
			//TODO: Fix this
			var pos = this.position.add(parentTransform.position);
			var rot = this.rotation + parentTransform.rotation;
			var scale = this.scale; //.x(parentTransform.scale);

			return new Transform(null,{position:pos,rotation:rot,scale:scale});
		},
		setRotationFromVector:function(vector){
			var angle = vector.angleFrom($V([0,-1]));

			if(vector.e(1) < 0)
				angle = (2 * Math.PI) - angle;

			

			this.rotation = angle;
		}
	};

	_inherit(Transform,Component);
	
	return Transform;
}();

//Renderers
var Renderer = function(){
	var Renderer = function(parent,paramMap){
		this._super(parent,paramMap);
	};
	
	Renderer.prototype = {
		zindex:0
	};
	
	_inherit(Renderer,Component);
	
	return Renderer;
}();

var SpriteRenderer = function(){
	var SpriteRenderer = function(parent,paramMap){
		this._super(parent,paramMap);
	};
	
	SpriteRenderer.prototype = {
		instantiate:function(parent,paramMap){
			var spriteRenderer = new SpriteRenderer(parent,paramMap);
			
			if(this.loaded)
			{
				spriteRenderer.spriteSheet = this.spriteSheet;
				spriteRenderer.width = this.width;
				spriteRenderer.height = this.height;
			}

			return spriteRenderer;
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				this.zindex = paramMap.zindex;
				this.src = paramMap.src;//'./sprites/gb_walk.png';
				this.spriteSheetSize = paramMap.spriteSheetSize;
				this.tiled = paramMap.tiled;
			}

			this.AABB = new AABB();
		},
		type:ComponentType.SpriteRenderer,
		spriteSheet:null,
		spriteSheetSize:{x:1,y:1},
		frameData:null,
		currentFrame:0,
		width:null,
		height:null,
		src:null,
		tiled:false,
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
				self.height = Math.floor(data.height / self.spriteSheetSize.y);
				self.loaded = true;
				loadInitiator.registerLoad(self);
			});
		},
		inView:function(){
			return true;
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
	var Collider = function(parent,paramMap){
		this._super(parent,paramMap);
	};
	
	Collider.prototype = {
		type:ComponentType.Collider,
		width:null,
		height:null,
		AABB:null,
		instantiate:function(parent,paramMap){	
			var collider = new Collider(parent,paramMap);
			
			Messenger.addListener('build collision',collider.onBuildCollision,collider);
			Messenger.addListener('check collision',collider.onCheckCollision,collider);
			Messenger.addListener('tick',collider.update,collider);

			return collider;
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				this.width = paramMap.width;
				this.height = paramMap.height;
			}
		},
		destroy:function(){
			Messenger.removeListener('build collision',this.onBuildCollision,this);
			Messenger.removeListener('check collision',this.onCheckCollision,this);
			Messenger.removeListener('tick',this.update,this);
		},
		update:function(gameTime){
			if(!this.AABB)
				this.AABB = new AABB(this.parent.transform.position,$V([this.width/2,this.height/2]));
			else
			{
				this.AABB.center = this.parent.transform.position;
			}
		},
		onBuildCollision:function(collision){
			collision.add(this.parent,this.AABB);
		},
		onCheckCollision:function(collision){
			var lastCollidingWith = this.collidingWith;
			this.collidingWith = collision.getCollisions(this.parent,this.AABB);

			if(this.collidingWith.length > 0)
			{
				if(this.parent.script.onCollisionStay)
					this.parent.script.onCollisionStay(this.collidingWith);

				if(lastCollidingWith && this.parent.script.onCollisionEnter)
				{
					for(var i in this.collidingWith)
					{
						if(lastCollidingWith.indexOf(this.collidingWith[i]) === -1)
							this.parent.script.onCollisionEnter(this.collidingWith[i]);
					}
				}
			}
		},		
	};
	
	_inherit(Collider,Component);
	
	return Collider;
}();

var SquareCollider = function(){
	
}();

var CircleCollider = function(){
	var CircleCollider = function(parent,paramMap){
		this._super(parent,paramMap);
	};

	CircleCollider.prototype = {
		instantiate:function(parent,paramMap){
			return new CircleCollider(parent,paramMap);
		},
		radius:null
	};
	
	_inherit(CircleCollider,Component);

	return CircleCollider;
}();

//Audio
var AudioEmitter = function(){
	
}();

//Scripting
var Script = function(){
	var Script = function(parent,paramMap){
		this._super(parent,paramMap);
	};

	Script.prototype = {
		instantiate:function(parent,paramMap){
			var script = new Script(parent,paramMap);

			Messenger.addListener('tick',script.update,script);
			Messenger.addListener('start',script.start,script);

			for(var i in this.listeners)
			{
				Messenger.addListener(script.listeners[i].signature,script[script.listeners[i].func],script);
			}

			return script;
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				for(var i in paramMap)
				{
					this[i] = paramMap[i];
				}
			}

			this.variables = {};
		},
		destroy:function(){
			Messenger.removeListener('tick',this.update,this);
			Messenger.removeListener('start',this.start,this);
		},
		script:null,
		update:function(){},
		start:function(){},
		variables:null,
		type:ComponentType.Script
	};

	_inherit(Script,Component)

	return Script;
}();

//Cameras
var Camera = function(){
	var Camera = function(parent,paramMap){
		this._super(parent,paramMap);
	};

	Camera.prototype = {
		AABB:null,
		zoom:$V([1,1]),
		type:ComponentType.Camera,
		instantiate:function(parent,paramMap){
			return new Camera(parent,paramMap);
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				this.zoom = paramMap.zoom;
				this.canvasSize = paramMap.canvasSize;
			}
		},
		getVisibleAABB:function(){
			var center = this.parent.transform.position;
			var rot = this.parent.transform.rotation;
			var scale = this.zoom;

			var NW_MATRIX = $M([[-1,0],[0,-1]]);
			var NE_MATRIX = $M([[1,0],[0,-1]]);
			var SW_MATRIX = $M([[-1,0],[0,1]]);
			var SE_MATRIX = $M([[1,0],[0,1]]);

			var halfDimension = $V([
				this.canvasSize.width * scale.e(1),
				this.canvasSize.height * scale.e(2)
			]).x(0.5);

			var rotMatrix = Matrix.Rotation(rot);

			var nw = rotMatrix.x(center.add(NW_MATRIX.x(halfDimension)));
			var ne = rotMatrix.x(center.add(NE_MATRIX.x(halfDimension)));
			var sw = rotMatrix.x(center.add(SW_MATRIX.x(halfDimension)));
			var se = rotMatrix.x(center.add(SE_MATRIX.x(halfDimension)));

			var minX = Math.min(nw.e(1),ne.e(1),sw.e(1),se.e(1));
			var maxX = Math.max(nw.e(1),ne.e(1),sw.e(1),se.e(1));
			var minY = Math.min(nw.e(2),ne.e(2),sw.e(2),se.e(2));
			var maxY = Math.max(nw.e(2),ne.e(2),sw.e(2),se.e(2));

			return new AABB(
				$V([minX + ((maxX - minX) / 2), minY + ((maxY - minY) / 2)]),
				$V([(maxX - minX) / 2, (maxY - minY) / 2]));
		}
	};

	_inherit(Camera,Component);

	return Camera;
}();

//Animations
var Animation = function(){
	var Animation = function(parent,paramMap){
		this._super(parent,paramMap);
	};

	Animation.prototype = {
		instantiate:function(parent,paramMap){
			var anim = new Animation(parent,paramMap);

			Messenger.addListener('tick',anim.update,anim);
			Messenger.addListener('start',anim.start,anim);

			return anim;
		},
		setProperties:function(paramMap){
			if(paramMap)
			{
				this.componentType = paramMap.componentType;
				this.property = paramMap.property;
				this.length = paramMap.length;
				this.keyFrameSets = paramMap.keyFrameSets;
				this.loop = paramMap.loop;
				this.defaultVal = paramMap.defaultVal;
				this.onComplete = paramMap.onComplete;
			}
		},
		destroy:function(){
			Messenger.removeListener('tick',this.update,this);
			Messenger.removeListener('start',this.start,this);
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
			this.startTime = performance.now();
			this.loopStart = performance.now();
			this.currentFrame = 0;
			this.running = true;
		},
		stop:function(){
			this.running = false;
			this.currentFrame = this.defaultVal;

			if(this.onComplete)
				this.onComplete();
		},
		update:function(gameTime){
			if(!this.component || this.component.type != this.componentType)
				this.component = this.parent.getComponentByType(this.componentType);

			if(this.component)
				this.component[this.property] = this.getFrame(gameTime);
		},
		getFrame:function(gameTime){
			if(this.running)
			{
				var t = (gameTime.now - this.loopStart);

				if(t >= this.length)
				{
					if(this.loop)
					{
						this.currentFrame = 0;
						this.loopStart = performance.now();
					}
					else
					{
						this.stop();
					}
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