var engine;

var cameraObj = new GameObject();
var cameraComp = new Camera();

cameraObj.addComponent(cameraComp);

var dogSprite = new SpriteRenderer();
var dogObj = new Prefab([dogSprite]);

var marioSprite = new SpriteRenderer();
var marioScript = new Script();
var marioAnim = new Animation();
var marioObj = new Prefab([marioSprite,marioScript,marioAnim],[dogObj]);


var paramMap = {
	children:[
		{
			spriteRenderer:{
				zindex:1,
				src:'./sprites/dog.png',
				spriteSheetSize:{x:1,y:1}
			},
			transform:{
				position:$V([-20,120,0])
			}
		}
	],
	script:{
		update:function(gameObject,gameTime){
			var anim = gameObject.getComponentByType(ComponentType.Animation);



			if(input.keyStates[39])
			{
				gameObject.transform.position.elements[0] += gameTime.deltaTime * 0.1;

				if(!anim.running)
				{
					anim.switchKeyFrameSet(0,12);
					anim.start();
				}
			}
			else if(input.keyStates[37])
			{
				gameObject.transform.position.elements[0] -= gameTime.deltaTime * 0.1;
				
				if(!anim.running)
				{
					anim.switchKeyFrameSet(1,13);
					anim.start();
				}
			}
			else
				anim.stop();
		}
	},
	transform:{
		position:$V([0,0,0])
	},
	spriteRenderer:{
		zindex:1,
		src:'./sprites/gb_walk.png',
		spriteSheetSize:{x:6,y:3}
	},
	animation:{
		componentType:ComponentType.SpriteRenderer,
		property:'currentFrame',
		length:1800,
		loop:true,
		defaultVal:12,
		keyFrameSets:[
			[
				{time:0,value:0},
				{time:300,value:1},
				{time:600,value:2},
				{time:900,value:3},
				{time:1200,value:4},
				{time:1500,value:5}
			],
			[
				{time:0,value:6},
				{time:300,value:7},
				{time:600,value:8},
				{time:900,value:9},
				{time:1200,value:10},
				{time:1500,value:11}
			]
		]
	}
};

var scene = new Scene(cameraObj,[cameraObj,marioObj.instantiate(paramMap)]);

$(document).ready(function(){
	engine = new Engine($('canvas')[0],[scene]);
});