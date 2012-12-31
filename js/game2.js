var engine;

var cameraCamera = new Camera();
var cameraScript = new Script();
var cameraPrefab = new Prefab([cameraCamera,cameraScript]);

var cameraParamMap = {
	script:{
		update:function(gameTime){
			var speed = 0.25;

			var dirVector = $V([0,0]);
			var rotation = 0;

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

			this.parent.transform.position = this.parent.transform.position.add(dirVector.x(speed * gameTime.deltaTime));
			this.parent.transform.rotation += rotation * gameTime.deltaTime;
		}
	}
};

var cameraObj = cameraPrefab.instantiate(cameraParamMap);

var shipSprite = new SpriteRenderer();
var shipScript = new Script();
var shipObj = new Prefab([shipSprite,shipScript]);

var paramMap2;

var gameObjects = [];

gameObjects.push(cameraObj);

for(var i = 0; i < 100; i++)
{
	paramMap2 = {
		spriteRenderer:{
			zindex:2,
			src:'./sprites/battleship2.gif',
			spriteSheetSize:{x:1,y:1}
		},
		transform:{
			position:$V([Math.random() * 1600, Math.random() * 1200]),
			rotation:(2 * Math.PI * Math.random())
		},
		script:{
			update:function(gameTime)
			{
				this.parent.transform.rotation += (gameTime.deltaTime * 0.001) * (2 * Math.PI);
			}
		}
	};
	gameObjects.push(shipObj.instantiate(paramMap2));
}

var scene = new Scene(cameraObj,gameObjects);

$(document).ready(function(){
	engine = new Engine($('canvas')[0],[scene],loadingScene);
});