var engine;

var cameraPrefab = new Prefab([new Camera(),new Script()]);

var cameraParamMap = {
	camera:{
		zoom:$V([0.5,0.5])
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
};

var cameraObj = cameraPrefab.instantiate(cameraParamMap);

var shipObj = new Prefab([new SpriteRenderer(), new Script(), new Animation(), new Collider()]);

var explObj = new Prefab([new SpriteRenderer(), new Animation]);

var paramMap2;

var gameObjects = [];

gameObjects.push(cameraObj);

for(var i = 0; i < 100; i++)
{
	paramMap2 = {
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
		transform:{
			position:$V([Math.random() * 1600, Math.random() * 1200])
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
				console.log('Hit something at ' + performance.now());

				this.parent.destroy();
			}
		}
	};
	gameObjects.push(shipObj.instantiate(paramMap2));
}

var scene = new Scene(cameraObj,gameObjects);

$(document).ready(function(){
	engine = new Engine($('canvas')[0],[scene],loadingScene);
});