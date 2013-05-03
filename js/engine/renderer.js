var Renderer = function(){
	var Renderer = function(context,height,width){
		this.context = context;
		this.height = height;
		this.width = width;
	};

	Renderer.prototype = {
		draw:function(drawBatch){
			var cameraObj = drawBatch.camera;
			var zoom = cameraObj.camera.zoom;

			var cameraOffsetX = cameraObj.transform.position.e(1);
			var cameraOffsetY = cameraObj.transform.position.e(2);

			
			this.context.clearRect(0,0,this.width,this.height);
			this.context.save();

			//Rotate around centre
			this.context.translate(this.width / 2,this.height / 2);
			this.context.scale(zoom.e(1),zoom.e(2));
			this.context.rotate(cameraObj.transform.rotation);
			this.context.translate(-this.width / 2,-this.height / 2);

			this.context.translate(-cameraOffsetX,-cameraOffsetY);

			for(var i in drawBatch.objects)
			{
				for(var j = 0; j < drawBatch.objects[i].length; j++)
				{
					this.context.save();

					this.context.translate(
						drawBatch.objects[i][j].trans.position.e(1),
						drawBatch.objects[i][j].trans.position.e(2)
					);
					
					this.context.scale(
						drawBatch.objects[i][j].trans.scale.e(1),
						drawBatch.objects[i][j].trans.scale.e(2)
					);

					this.context.rotate(drawBatch.objects[i][j].trans.rotation);
					
					this.context.translate(
						-drawBatch.objects[i][j].crop.width / 2,
						-drawBatch.objects[i][j].crop.height / 2
					);

					this.context.drawImage(
						drawBatch.objects[i][j].img,
						drawBatch.objects[i][j].crop.x,
						drawBatch.objects[i][j].crop.y,
						drawBatch.objects[i][j].crop.width,
						drawBatch.objects[i][j].crop.height,
						0,
						0,
						drawBatch.objects[i][j].crop.width,
						drawBatch.objects[i][j].crop.height);


					this.context.restore();
				}
			}

			//START:DEBUGGING
			this.context.save();

			this.context.strokeStyle='#66FF66';
			this.context.strokeRect(
				drawBatch.bounds.center.elements[0] - drawBatch.bounds.halfDimension.elements[0],
				drawBatch.bounds.center.elements[1] - drawBatch.bounds.halfDimension.elements[1],
				drawBatch.bounds.halfDimension.elements[0] * 2,
				drawBatch.bounds.halfDimension.elements[1] * 2
			);

			this.context.restore();
			//START:END DEBUGGING			

			this.context.restore();
		}

	};

	return Renderer;
}();