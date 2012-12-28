var engine;

var cameraObj = new GameObject();
var cameraComp = new Camera();

cameraObj.addComponent(cameraComp);

var shipSprite = new SpriteRenderer();
var shipScript = new Script();
var shipObj = new Prefab([shipSprite,shipScript]);

var paramMap = {
	script:{
		start:function(gameObject){
			gameObject.transform.position = Vector.Random(3).x(500);

			this.target = Vector.Random(3).x(1000);
		},
		update:function(gameObject,gameTime){
			gameObject.transform.position = Vector.Random(3).x(500);
		}
	},
	spriteRenderer:{
		zindex:1,
		src:'./sprites/battleship2.gif',
		spriteSheetSize:{x:1,y:1}
	}
};


var gameObjects = [];

gameObjects.push(cameraObj);

for(var i = 0; i < 1; i++)
{
	gameObjects.push(shipObj.instantiate(paramMap));
}


var scene = new Scene(cameraObj,gameObjects);

$(document).ready(function(){
	engine = new Engine($('canvas')[0],[scene]);
});