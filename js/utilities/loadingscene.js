var cameraPrefab = new Prefab(
	[new Camera()],
	{
		camera:{
			zoom:$V([1,1]),
			canvasSize:{
				width:800,
				height:600
			}
		}
	}
);

var loadingTextPrefab = new Prefab(
	[new SpriteRenderer()],
	{
		spriteRenderer:{
			zindex:1,
			src:'./sprites/loading/loadingtext.png',
			spriteSheetSize:{x:1,y:1}
		},
		transform:{
			position:$V([300,200,0])
		}
	}
);

var progressBarPrefab = new Prefab(
	[new SpriteRenderer(),new Script()],
	{
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
	}
);

var cameraObj = cameraPrefab.instantiate();

var loadingScene = new Scene(cameraObj,[
	cameraObj,
	loadingTextPrefab.instantiate(),
	progressBarPrefab.instantiate()
]);