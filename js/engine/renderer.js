var Renderer = function(){
	var Renderer = function(context,height,width){
		this.context = context;
		this.height = height;
		this.width = width;
	};

	Renderer.prototype = {
		draw:function(drawBatch){
			var camera = drawBatch.camera;
			var viewportSize = camera.getComponentByType(ComponentType.Camera).viewportSize;
			var transform = camera.getComponentByType(ComponentType.Transform);
			var position = transform.position;
			var rotation = transform.rotation;

			this.context.clearRect(0,0,this.width,this.height);

			for(var i in drawBatch.objects)
			{
				for(var j = 0; j < drawBatch.objects[i].length; j++)
				{
					this.context.drawImage(
						drawBatch.objects[i][j].img,
						drawBatch.objects[i][j].crop.x,
						drawBatch.objects[i][j].crop.y,
						drawBatch.objects[i][j].crop.width,
						drawBatch.objects[i][j].crop.height,
						drawBatch.objects[i][j].trans.position.elements[0],
						drawBatch.objects[i][j].trans.position.elements[1],
						drawBatch.objects[i][j].crop.width,
						drawBatch.objects[i][j].crop.height);
				}
			}

		}

	};

	return Renderer;
}();