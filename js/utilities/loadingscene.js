var cameraCamera = new Camera();
var cameraPrefab = new Prefab([cameraCamera]);

var loadingTextParams = {
	spriteRenderer:{
		zindex:1,
		src:'./sprites/loading/loadingtext.png',
		spriteSheetSize:{x:1,y:1}
	},
	transform:{
		position:$V([300,200,0])
	}
};

var progressBarParams = {
	spriteRenderer:{
		zindex:1,
		src:'./sprites/loading/progressbar.png',
		spriteSheetSize:{x:2,y:5}
	},
	transform:{
		position:$V([300,250,0])
	},
	script:{
		OnLoadProgress:function(progress){
			this.parent.spriteRenderer.currentFrame = Math.floor(10 * progress);
		},
		listeners:[
			{
				signature:'loadProgress',
				func:'OnLoadProgress'
			}
		]
	}
};


var loadingTextSprite = new SpriteRenderer();
var loadingTextPrefab = new Prefab([loadingTextSprite]);

var progressBarSprite = new SpriteRenderer();
var progressBarScript = new Script();
var progressBarPrefab = new Prefab([progressBarSprite,progressBarScript]);

var cameraObj = cameraPrefab.instantiate({});

var loadingScene = new Scene(cameraObj,[
	cameraObj,
	loadingTextPrefab.instantiate(loadingTextParams),
	progressBarPrefab.instantiate(progressBarParams)
]);