var engine;

var cameraPrefab = new Prefab(
	[new Camera(), new Script()],
	{
		camera:{
			zoom:$V([0.5,0.5]),
			canvasSize:{
				width:800,
				height:600
			}
		},
		transform:{
			position:$V([300,300])
		},
		script:{
			update:function(gameTime){
				var speed = 500;

				var dirVector = $V([0,0]);
				var rotation = 0;

				var zoom = $V([0,0]);

				if(input.keyStates[37]) //Left
					dirVector = dirVector.add($V([-1,0]));

				if(input.keyStates[39]) //Right
					dirVector = dirVector.add($V([1,0]));

				if(input.keyStates[38]) //Up
					dirVector = dirVector.add($V([0,-1]));

				if(input.keyStates[40]) //Down
					dirVector = dirVector.add($V([0,1]));

				if(input.keyStates[81]) //Rotate Left
					rotation -= Math.PI * 0.001;

				if(input.keyStates[69]) //Rotate Right
					rotation += Math.PI * 0.001;

				if(input.keyStates[87])
					zoom = zoom.add($V([1,1]));

				if(input.keyStates[83])
					zoom = zoom.add($V([-1,-1]));

				this.parent.transform.position = this.parent.transform.position.add(dirVector.x(speed * gameTime.deltaTime));
				this.parent.transform.rotation += rotation * gameTime.deltaTime * 100;
				this.parent.camera.zoom = this.parent.camera.zoom.add(zoom.x(gameTime.deltaTime * 0.5))
			}
		}
	}
);

var cameraObj = cameraPrefab.instantiate();

var shipObj = new Prefab(
	[new SpriteRenderer(), new Script(), new Animation(), new Collider()],
	{
		collider:{
			width:40,
			height:40
		},
		animation:{
			keyFrameSets:[
				[
					{time:0,value:1},
					{time:100,value:2},
				]
			],
			defaultVal:0,
			length:200,
			loop:true,
			componentType:ComponentType.SpriteRenderer,
			property:'currentFrame'
		},
		spriteRenderer:{
			zindex:2,
			src:'./sprites/shipanim.png',
			spriteSheetSize:{x:3,y:1}
		},
		script:{
			start:function(){
				this.parent.animation.switchKeyFrameSet(0,0);
				this.parent.animation.start();


				this.target = $V([Math.random() * 1600, Math.random() * 1200]);
				this.maxSpeed = 5;
				this.accel = 1;
				this.speed = 0;

				this.direction = this.target.subtract(this.parent.transform.position).toUnitVector();

				this.parent.transform.setRotationFromVector(this.direction);

				this.atTarget = false;
			},
			update:function(gameTime)
			{
				if(this.parent.transform.position.distanceFrom(this.target) < 100)
				{
					this.atTarget = true;
					this.parent.animation.stop();
				}

				if(!this.atTarget)
					this.speed = Math.min(this.speed + (this.accel * gameTime.deltaTime),this.maxSpeed);
				else
					this.speed = Math.max(this.speed - (this.accel * gameTime.deltaTime),0);

				if(this.atTarget && this.speed <= 0)
				{
					this.target = $V([Math.random() * 1600, Math.random() * 1200]);
					this.direction = this.target.subtract(this.parent.transform.position).toUnitVector();
					this.parent.transform.setRotationFromVector(this.direction);
					this.atTarget = false;
					this.parent.animation.start();
				}

				var step = this.direction.x(this.speed);

				this.parent.transform.position = this.parent.transform.position.add(step);
			},
			onCollisionEnter:function(obj){
				var explObj = explPrefab.instantiate({
					transform:{
						position:this.parent.transform.position
					}
				});

				scene.addGameObject(explObj);

				explObj.animation.start();

				this.parent.destroy();
			}
		}
	}
);

var explPrefab = new Prefab([new SpriteRenderer(), new Animation()],{
	spriteRenderer:{
		zindex:3,
		src:'./sprites/exp2.png',
		spriteSheetSize:{x:4,y:4}
	},
	animation:{
		keyFrameSets:[
			[
				{time:0,value:0},
				{time:10,value:1},
				{time:20,value:2},
				{time:30,value:3},
				{time:40,value:4},
				{time:50,value:5},
				{time:60,value:6},
				{time:70,value:7},
				{time:80,value:8},
				{time:90,value:9},
				{time:100,value:10},
				{time:110,value:11},
				{time:120,value:12},
				{time:130,value:13},
				{time:140,value:14},
				{time:150,value:15},
			]
		],
		defaultVal:0,
		length:160,
		loop:false,
		onComplete:function(){
			this.parent.destroy();
		},
		componentType:ComponentType.SpriteRenderer,
		property:'currentFrame'
	}
});

var starfieldPrefab = new Prefab([new SpriteRenderer()],{
	spriteRenderer:{
		zindex:0,
		src:'./sprites/starfield.jpg',
		spriteSheetSize:{x:1,y:1},
		viewSpace:true
	},
	transform:{
		position:$V([656,443]),
		scale:$V([2,2])
	}
});

var gameObjects = [];

gameObjects.push(cameraObj);
gameObjects.push(starfieldPrefab.instantiate());

for(var i = 0; i < 100; i++)
{
	gameObjects.push(shipObj.instantiate({		
		transform:{
			position:$V([Math.random() * 1600, Math.random() * 1200])
		}
	}));
}

var scene = new Scene(cameraObj,gameObjects,[explPrefab]);

$(document).ready(function(){
	engine = new Engine($('canvas')[0],[scene],loadingScene);
});